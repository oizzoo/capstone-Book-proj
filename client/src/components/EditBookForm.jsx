import { useState } from "react";

export default function EditBookForm({ book, onCancel, onSave }) {
  const [form, setForm] = useState({
    rating: book.rating || "",
    review: book.review || "",
    status: book.status || "planned",
    date_read: book.date_read || "",
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
    <form onSubmit={handleSubmit} className="edit-form" style={{ marginTop: "2rem" }}>
      <h2>Edit: {book.title}</h2>

      <input
        type="number"
        name="rating"
        min="0"
        max="10"
        value={form.rating}
        onChange={handleChange}
        placeholder="Rating"
      />

      <input
        type="text"
        name="review"
        value={form.review}
        onChange={handleChange}
        placeholder="Review"
      />

      <select name="status" value={form.status} onChange={handleChange}>
        <option value="planned">Planned</option>
        <option value="reading">Reading</option>
        <option value="finished">Finished</option>
      </select>

      <input
        type="date"
        name="date_read"
        value={form.date_read || ""}
        onChange={handleChange}
      />

      <div style={{ marginTop: "1rem" }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: "1rem" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
