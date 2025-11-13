import { useState } from "react";
import { supabase } from "../supabaseClient";

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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to add a book.");
      return;
    }

    const { error } = await supabase.from("books").insert([
      {
        title: formData.title,
        rating: parseInt(formData.rating),
        review: formData.review,
        date_read: formData.date_read || null,
        status: formData.status,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error adding book:", error.message);
      alert("Error: " + error.message);
    } else {
      alert("Book added successfully!");
      setFormData({
        title: "",
        rating: "",
        review: "",
        date_read: "",
        status: "planned",
      });
      if (onBookAdded) onBookAdded();
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
        min="0"
        max="10"
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
