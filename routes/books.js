import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});
db.connect();

// GET /books – testowy route
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching books");
  }
});

export default router;
