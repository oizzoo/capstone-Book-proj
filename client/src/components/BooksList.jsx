import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function BooksList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('id', { ascending: false });
    if (error) {
      console.error('Error fetching books:', error);
    } else {
      setBooks(data);
    }
  }

  return (
    <div>
      <h1>Your Books</h1>
      <ul>
        {books.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
}
