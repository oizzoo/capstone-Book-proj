import { useEffect, useState } from "react";
import "./BooksList.css";

export default function BooksList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  return (
    <div className="books-container">
      <h1>📚 My Books</h1>

      {books.length === 0 ? (
        <p>No books yet. Add one below!</p>
      ) : (
        <ul className="books-list">
          {books.map((book) => (
            <li key={book.id} className="book-card">
              <img
                src={book.cover_url}
                alt={book.title}
                className="book-cover"
              />
              <div>
                <h2>{book.title}</h2>
                <p className="author">by {book.author}</p>
                <p>Status: {book.status}</p>
                <p>⭐ {book.rating}/10</p>
                <p>{book.review}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
