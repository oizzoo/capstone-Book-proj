import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
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
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));

app.set("views", path.join(__dirname, "Views"));
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
      message: "Your Reading Hub: Manage Your Books, Plan Your Journey!",
      books: books,
      showAddButton: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add-book", async (req, res) => {
  let { title, rating, review, date_read, status  } = req.body;

  if (!rating || rating < 0 || rating > 10) {
    return res.status(400).send("Rating must be between 0 and 10");
  }
  
  if (!date_read) {
    date_read = null;
  }

  const cleanedTitle = title.trim();

  try {
    const books = await searchByTitle(cleanedTitle);

    if (!books || books.length === 0) {
      return res.status(404).send("Book not found in Open Library.");
    }

    const book = books[0];

    const bookCover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
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
      "INSERT INTO books (title, author, rating, review, date_read, cover_url, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [bookTitle, author, rating, review, date_read, bookCover, status ]
    );

    res.redirect("/");
  } catch (error) {
    console.error("Whoops, we got an error while adding book:", error);
    res.status(500).send("Server Error");
  }
});

// Selecting books by status

app.get("/books/all", (req, res) => res.redirect("/"));

app.get("/books/:status", async (req, res) => {
  const status = req.params.status; 
  const validStatuses = ["all", "reading", "planned", "finished"];

  if (!validStatuses.includes(status)) {
    return res.status(400).send("Invalid status");
  }
  try {
    let query = "SELECT * FROM books";
    let queryParams = [];
    if (status !== "all") {
      query += " WHERE status = $1";
      queryParams.push(status);
    }
    query += " ORDER BY id DESC";

    const result = await db.query(query, queryParams);
    const books = result.rows;
    res.render("index", {
      message: `Books with status: ${status}`,
      books: books,
      showAddButton: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }

});

// Editing books
app.get("/edit-book/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [bookId]);
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }
    const book = result.rows[0];
    res.render("edit", { book });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/edit-book/:id", async (req, res) => {
  const bookId = req.params.id;
  let { rating, review, status, date_read } = req.body;

  if (!date_read) {
    date_read = null;
  }

  try {
    await db.query(
      `UPDATE books 
       SET rating = $1, review = $2, status = $3, date_read = $4 
       WHERE id = $5`,
      [rating, review, status, date_read, bookId]
    );
    res.redirect("/");
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).send("Server Error");
  }
});



// Deleting books
app.post("/delete-book/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    await db.query("DELETE FROM books WHERE id = $1", [bookId]);
    await db.query("SELECT setval(pg_get_serial_sequence('books', 'id'), COALESCE((SELECT MAX(id) FROM books), 0) + 1, false)");
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).send("Server Error");
  }
});


// Server start

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
