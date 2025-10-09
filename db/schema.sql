CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 10),
  review TEXT,
  date_read DATE,
  cover_url TEXT
);
