import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AddBookForm({ onBookAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    rating: '',
    review: '',
    status: 'planned',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: user } = await supabase.auth.getUser();

    const { error } = await supabase.from('books').insert([
      {
        ...formData,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error('Error adding book:', error);
      alert('Error adding book');
    } else {
      alert('Book added!');
      onBookAdded();
      setFormData({
        title: '',
        author: '',
        rating: '',
        review: '',
        status: 'planned',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <input
        name="author"
        placeholder="Author"
        value={formData.author}
        onChange={handleChange}
      />
      <input
        name="rating"
        type="number"
        min="1"
        max="10"
        placeholder="Rating"
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
      <button type="submit">Add Book</button>
    </form>
  );
}
