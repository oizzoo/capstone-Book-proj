-- Seed data for books table
INSERT INTO books (title, author, rating, review, date_read, cover_url, status)
VALUES
('Atomic Habits', 'James Clear', 9, 'Great insights on habit formation.', '2024-03-15', 'https://covers.openlibrary.org/b/isbn/0735211299-L.jpg', 'finished'),
('Deep Work', 'Cal Newport', 8, 'Focus and productivity redefined.', '2024-04-10', 'https://covers.openlibrary.org/b/isbn/1455586692-L.jpg', 'finished'),
('The Hobbit', 'J.R.R. Tolkien', 7, 'Exciting adventure, a bit slow at times.', NULL, 'https://covers.openlibrary.org/b/isbn/054792822X-L.jpg', 'reading'),
('Sapiens', 'Yuval Noah Harari', 10, 'Mind-blowing history of humankind.', NULL, 'https://covers.openlibrary.org/b/isbn/0062316095-L.jpg', 'planned');