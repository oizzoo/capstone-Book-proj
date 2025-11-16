import { useState } from "react";
import "./EditBookForm.css";

export default function EditBookForm({ book, onCancel, onSave }) {
  const [form, setForm] = useState({
    rating: book.rating || "",
    review: book.review || "",
    status: book.status || "planned",
    date_read: book.date_read ? book.date_read.split('T')[0] : "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanForm = {
      ...form,
      date_read: form.date_read === "" ? null : form.date_read
    };
    onSave(cleanForm);
  };

  return (
    <div className="edit-form-container">
      <form onSubmit={handleSubmit} className="edit-form">
        <h2>Edit: {book.title}</h2>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rating">Rating *</label>
            <input
              id="rating"
              type="number"
              name="rating"
              min="0"
              max="10"
              value={form.rating}
              onChange={handleChange}
              placeholder="0-10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select 
              id="status"
              name="status" 
              value={form.status} 
              onChange={handleChange}
            >
              <option value="planned">Planned</option>
              <option value="reading">Reading</option>
              <option value="finished">Finished</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="review">Review</label>
          <textarea
            id="review"
            name="review"
            value={form.review}
            onChange={handleChange}
            placeholder="Share your thoughts about this book..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="date_read">Date Read</label>
          <input
            id="date_read"
            type="date"
            name="date_read"
            value={form.date_read || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-save">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}