-- Schema for books table
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 10),
  review TEXT,
  date_read DATE,
  cover_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('reading', 'planned', 'finished'))
);