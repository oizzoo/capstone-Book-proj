import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

db.connect();


const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// search function
async function searchByTitle(title) {
  try {
    const response = await axios.get(`https://openlibrary.org/search.json?title=${title}`);
    return response.data.docs;
  } catch (error) {
    console.error("Error fetching data from Open Library API:", error);
    return [];  
  }
}

// Routes

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY id DESC");
    const books = result.rows;
    res.render("index", {
      message: "Welcome to your personal library – track the books you've read, plan the ones you want to read, and manage your reading journey!",
      books: books,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add-book", async (req, res) => {
  const { title, rating, review, date_read } = req.body;
  const cleanedTitle = title.trim();

  try {
    const books = await searchByTitle(cleanedTitle);

    if (!books || books.length === 0) {
      return res.status(404).send("Book not found in Open Library.");
    }

    const book = books[0];

    const bookCover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "https://via.placeholder.com/150x200?text=No+Cover";

    const author = book.author_name ? book.author_name[0] : "Unknown";
    const bookTitle = book.title || cleanedTitle;

    // check for duplicate
    const existing = await db.query(
      "SELECT * FROM books WHERE title = $1 AND author = $2",
      [bookTitle, author]
    );

    if (existing.rows.length > 0) {
      return res.status(409).send("Book already exists in your library.");
    }

    await db.query(
      "INSERT INTO books (title, author, rating, review, date_read, cover_url) VALUES ($1, $2, $3, $4, $5, $6)",
      [bookTitle, author, rating, review, date_read, bookCover]
    );

    res.redirect("/");
  } catch (error) {
    console.error("Whoops, we got an error while adding book:", error);
    res.status(500).send("Server Error");
  }
});



// Server start
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
