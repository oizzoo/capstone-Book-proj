import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index", { message: "Hello from EJS + Express! 🚀" });
});

// Server start
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
