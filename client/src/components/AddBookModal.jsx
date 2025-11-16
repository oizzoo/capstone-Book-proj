import { useState } from "react";
import { supabase } from "../supabaseClient";
import './AddBookModal.css';

export default function AddBookModal({ onClose, onBookAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    rating: "",
    review: "",
    date_read: "",
    status: "planned",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { title, rating, review, date_read, status } = formData;

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("You must be logged in to add a book!");
      setLoading(false);
      return;
    }

    // Fetch OpenLibrary
    let cover_url = "https://via.placeholder.com/150x200?text=No+Cover";
    let author = "Unknown";

    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
      const data = await res.json();
      if (data.docs && data.docs.length > 0) {
        const book = data.docs[0];
        if (book.cover_i) {
          cover_url = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
        }
        if (book.author_name) {
          author = book.author_name[0];
        }
      }
    } catch (err) {
      console.error("OpenLibrary fetch failed:", err);
    }

    // Insert to Supabase
    const { error } = await supabase.from("books").insert([
      {
        title,
        author,
        rating: Number(rating),
        review,
        date_read: date_read || null,
        status,
        cover_url,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book: " + error.message);
    } else {
      setFormData({
        title: "",
        rating: "",
        review: "",
        date_read: "",
        status: "planned",
      });
      if (onBookAdded) onBookAdded();
      onClose();
    }

    setLoading(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose} />
      
      {/* Modal */}
      <div className="modal-container">
        <div className="modal-header">
          <h2>📖 Add a New Book</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              name="title"
              placeholder="Enter book title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rating *</label>
              <input
                name="rating"
                type="number"
                placeholder="1-10"
                value={formData.rating}
                min="1"
                max="10"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="planned">Planned</option>
                <option value="reading">Reading</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Review</label>
            <textarea
              name="review"
              placeholder="Your thoughts about this book..."
              value={formData.review}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Date Read</label>
            <input
              name="date_read"
              type="date"
              value={formData.date_read}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}