import { useEffect, useState } from "react";
import "./BooksList.css";

export default function BooksList({ onEdit, onDelete }) {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/books", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          throw new Error("Invalid data format from server");
        }
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setError(err.message);
        setBooks([]);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`/delete-book/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } else {
      console.error("Failed to delete book");
    }
  };

  return (
    <div className="books-container">
      <h1>Your Reading Hub: Manage Your Books, Plan Your Journey!</h1>

      {error && <p className="error-message">Error: {error}</p>}

      {!error && books.length === 0 && <p>No books yet. Add one below!</p>}

      {!error && Array.isArray(books) && books.length > 0 && (
        <ul className="books-list">
          {books.map((book) => (
            <li key={book.id} className="book-card">
              <img src={book.cover_url} alt={book.title} className="book-cover" />
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
