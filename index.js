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

// Routes
import booksRouter from "./routes/books.js";
app.use("/books", booksRouter);

app.get("/", (req, res) => {
  res.render("index", { message: "Hello from EJS + Express! 🚀" });
});

// Server start
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
