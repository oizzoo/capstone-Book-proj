import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./BooksList.css";

export default function BooksList({ onEdit, onDelete }) {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in.");
      return;
    }

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setBooks(data);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      setBooks((prev) => prev.filter((book) => book.id !== id));
    }
  };

  return (
    <div className="books-container">
      <h1>Your Reading Hub: Manage Your Books, Plan Your Journey!</h1>

      {error && <p className="error-message">Error: {error}</p>}

      {!error && books.length === 0 && <p>No books yet. Add one below!</p>}

      {!error && books.length > 0 && (
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
