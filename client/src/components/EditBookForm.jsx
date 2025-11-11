import { useState } from "react";

export default function EditBookForm({ book, onCancel, onUpdated }) {
  const [formData, setFormData] = useState({
    rating: book.rating,
    review: book.review || "",
    status: book.status || "planned",
    date_read: book.date_read ? book.date_read.split("T")[0] : "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/edit-book/${book.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onUpdated();
    } else {
      console.error("Error updating book");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
      <h2>Edit Book: {book.title}</h2>
      <input
        name="rating"
        placeholder="Rating (0–10)"
        type="number"
        value={formData.rating}
        onChange={handleChange}
      />
      <input
        name="review"
        placeholder="Review"
        value={formData.review}
        onChange={handleChange}
      />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="planned">Planned</option>
        <option value="reading">Reading</option>
        <option value="finished">Finished</option>
      </select>
      <input
        name="date_read"
        type="date"
        value={formData.date_read}
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
