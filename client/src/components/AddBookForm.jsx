import { useState } from "react";

export default function AddBookForm({ onBookAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    rating: "",
    review: "",
    date_read: "",
    status: "planned",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/add-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onBookAdded(); // odśwież listę po dodaniu
      setFormData({
        title: "",
        rating: "",
        review: "",
        date_read: "",
        status: "planned",
      });
    } else {
      console.error("Error adding book");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
      <h2>Add a new book</h2>
      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <input
        name="rating"
        placeholder="Rating (0–10)"
        type="number"
        value={formData.rating}
        onChange={handleChange}
        required
      />
      <input
        name="review"
        placeholder="Review"
        value={formData.review}
        onChange={handleChange}
      />
      <input
        name="date_read"
        type="date"
        value={formData.date_read}
        onChange={handleChange}
      />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="planned">Planned</option>
        <option value="reading">Reading</option>
        <option value="finished">Finished</option>
      </select>
      <button type="submit">Add Book</button>
    </form>
  );
}
