import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./AddBookForm.css";

export default function AddBookForm({ onBookAdded }) {
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

    const {
      title,
      rating,
      review,
      date_read,
      status
    } = formData;

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("You must be logged in to add a book!");
      setLoading(false);
      return;
    }

    // fetch OpenLibrary
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

    // Supabase
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
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="add-book-form">
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
        type="number"
        placeholder="Rating (1–10)"
        value={formData.rating}
        min="1"
        max="10"
        onChange={handleChange}
        required
      />
      <input
        name="review"
        placeholder="Your review"
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

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Book"}
      </button>
    </form>
  );
}
