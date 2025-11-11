import { useEffect, useState } from "react";
import "./BooksList.css";

export default function BooksList({ onEdit, onDelete }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    const res = await fetch(`/delete-book/${id}`, {
      method: "POST",
    });

    if (res.ok) {
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } else {
      console.error("Failed to delete book");
    }
  };

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

                <div className="actions">
                  <button onClick={() => onEdit(book)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(book.id)}>🗑️ Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
