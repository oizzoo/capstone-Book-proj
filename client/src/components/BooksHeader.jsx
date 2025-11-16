import { useState } from 'react';
import './BooksHeader.css';

export default function BooksHeader({ onFilterChange, onAddClick, activeFilter }) {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'planned', label: 'Planned' },
    { key: 'reading', label: 'Reading' },
    { key: 'finished', label: 'Finished' }
  ];

  return (
    <div className="books-header">
      <div className="header-top">
        <h1 className="books-title">📚 My Books</h1>
        <button className="add-book-btn" onClick={onAddClick}>
          + Add Book
        </button>
      </div>
      
      <div className="filters">
        {filters.map(filter => (
          <button
            key={filter.key}
            className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}