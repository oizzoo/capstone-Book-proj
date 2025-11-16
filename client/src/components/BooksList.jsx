import "./BooksList.css";

export default function BooksList({ books, onEdit, onDelete  }) {
  if (!books.length) {
    return <p>No books yet. Add one below!</p>;
  }

  return (
    <div className="books-container">
      <h1>📚 My Books</h1>
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
              {book.date_read && (
                <p>📅 Read on: {new Date(book.date_read).toLocaleDateString()}</p>
              )}
            </div>
            <div className="actions">
              <button onClick={() => onEdit(book)}>Edit</button>
              <button onClick={() => onDelete(book.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
