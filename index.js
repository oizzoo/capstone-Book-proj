import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
dotenv.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

db.connect();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


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

app.post("/auth/google", async (req, res) => {
  const { credential } = req.body;

  try {
    const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${credential}` }
    });

    const payload = userInfo.data;
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    let userResult = await db.query("SELECT * FROM users WHERE google_id = $1", [googleId]);
    let user;

    if (userResult.rows.length === 0) {
      const insertResult = await db.query(
        "INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *",
        [googleId, email, name]
      );
      user = insertResult.rows[0];
    } else {
      user = userResult.rows[0];
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });

  } catch (error) {
    console.error("Google auth error:", error.response?.data || error.message);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

app.post("/add-book", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  let { title, rating, review, date_read, status  } = req.body;

  if (!title || !rating || rating < 0 || rating > 10) {
    return res.status(400).json({ error: "Title and rating are required and rating must be between 0 and 10." });
  }
  
  if (!date_read) {
    date_read = null;
  }

  const cleanedTitle = title.trim();

  try {
    const books = await searchByTitle(cleanedTitle);

    if (!books || books.length === 0) {
      return res.status(404).json({ error: "Book not found in Open Library." });
    }

    const book = books[0];

    const bookCover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : "https://via.placeholder.com/150x200?text=No+Cover";

    const author = book.author_name ? book.author_name[0] : "Unknown";
    const bookTitle = book.title || cleanedTitle;

    // check for duplicate
    const existing = await db.query(
      "SELECT * FROM books WHERE title = $1 AND author = $2 AND user_id = $3",
      [bookTitle, author, userId]
    );

    if (existing.rows.length > 0) {
      return res.status(409).send("You already have this book in your library.");
    }

    await db.query(
      "INSERT INTO books (title, author, rating, review, date_read, cover_url, status, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [bookTitle, author, rating, review, date_read, bookCover, status, userId]
    );

    res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
    console.error("Whoops, we got an error while adding book:", error);
    res.status(500).send("Server Error");
  }
});

// === API endpoint for React frontend ===
app.get("/api/books", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query("SELECT * FROM books WHERE user_id = $1 ORDER BY id DESC", [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
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
app.post("/edit-book/:id", authenticateToken, async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id;
  let { rating, review, status, date_read } = req.body;

  if (!date_read) date_read = null;

  try {
    // SPRAWDŹ, CZY KSIĄŻKA JEST TWOJA
    const check = await db.query("SELECT * FROM books WHERE id = $1 AND user_id = $2", [bookId, userId]);
    if (check.rows.length === 0) {
      return res.status(403).send("You can only edit your own books.");
    }

    await db.query(
      `UPDATE books 
       SET rating = $1, review = $2, status = $3, date_read = $4 
       WHERE id = $5 AND user_id = $6`,
      [rating, review, status, date_read, bookId, userId]
    );
    res.redirect("/");
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).send("Server Error");
  }
});

// Deleting books
app.post("/delete-book/:id", authenticateToken, async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id;
  
  try {
    const check = await db.query("SELECT * FROM books WHERE id = $1 AND user_id = $2", [bookId, userId]);
    if (check.rows.length === 0) {
      return res.status(403).send("You can only delete your own books.");
    }

    await db.query("DELETE FROM books WHERE id = $1 AND user_id = $2", [bookId, userId]);
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
