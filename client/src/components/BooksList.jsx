import "./BooksList.css";

export default function BooksList({ books, onEdit, onDelete }) {
  if (!books.length) {
    return (
      <div className="books-container">
        <p className="no-books-message">
          📚 No books found. Click "Add Book" to start your collection!
        </p>
      </div>
    );
  }

  return (
    <div className="books-container">
      <ul className="books-list">
        {books.map((book) => (
          <li key={book.id} className="book-card">
            <img src={book.cover_url} alt={book.title} className="book-cover" />
            <div className="book-info">
              <h2>{book.title}</h2>
              <p className="author">by {book.author}</p>
              <p className="status">Status: <span className={`status-badge ${book.status}`}>{book.status}</span></p>
              <p className="rating">⭐ {book.rating}/10</p>
              {book.review && <p className="review">{book.review}</p>}
              {book.date_read && (
                <p className="date-read">📅 Read on: {new Date(book.date_read).toLocaleDateString()}</p>
              )}
            </div>
            <div className="actions">
              <button className="btn-edit" onClick={() => onEdit(book)}>Edit</button>
              <button className="btn-delete" onClick={() => onDelete(book.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}