import { useEffect, useState } from "react";
import Navbar from "./components/navbar/Navbar";
import BooksList from "./components/BooksList";
import BooksHeader from "./components/BooksHeader";
import AddBookModal from "./components/AddBookModal";
import EditBookForm from "./components/EditBookForm";
import { supabase } from "./supabaseClient";
import { useAuth } from "./context/AuthContext";
import { getBooks, addBook } from "./api/books";

function App() {
  const { user, loading } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (user) {
      getBooks(user.id).then(data => {
        setBooks(data);
        setFilteredBooks(data);
      });
    }
  }, [user]);

  // Filter books when filter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter(book => book.status === activeFilter));
    }
  }, [activeFilter, books]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleAddBook = async (bookData) => {
    const newBook = { ...bookData, user_id: user.id };
    await addBook(newBook);
    const updatedBooks = await getBooks(user.id);
    setBooks(updatedBooks);
  };

  const handleEditBook = async (bookId, updates) => {
    await supabase
      .from("books")
      .update(updates)
      .eq("id", bookId);

    const updated = await getBooks(user.id);
    setBooks(updated);
  };

  const handleDeleteBook = async (bookId) => {
    await supabase
      .from("books")
      .delete()
      .eq("id", bookId);

    const updated = await getBooks(user.id);
    setBooks(updated);
  };

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "4rem", textAlign: "center" }}>
          <h1>Log in to start tracking your books!</h1>
          <p>Sign in with Google to add, edit, and organize your reading list.</p>
        </div>
      </>
    );
  }

  return (
    <>
      {editingBook ? (
        <>
          <Navbar />
          <EditBookForm
            book={editingBook}
            onCancel={() => setEditingBook(null)}
            onSave={async (updates) => {
              await handleEditBook(editingBook.id, updates);
              setEditingBook(null);
            }}
          />
        </>
      ) : (
        <>
          <Navbar />
          <div style={{ padding: "2rem" }}>
            <BooksHeader
              onFilterChange={handleFilterChange}
              onAddClick={() => setShowAddModal(true)}
              activeFilter={activeFilter}
            />
            <BooksList
              books={filteredBooks}
              onEdit={setEditingBook}
              onDelete={handleDeleteBook}
            />
          </div>

          {showAddModal && (
            <AddBookModal
              onClose={() => setShowAddModal(false)}
              onBookAdded={handleAddBook}
            />
          )}

          <footer style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: '#666',
            borderTop: '1px solid #e0e0e0',
            marginTop: '2rem'
          }}>
            <a 
              href="https://oizzoo.github.io/capstone-Book-proj/privacy.html" 
              style={{ color: '#e65b65', textDecoration: 'none' }}
            >
              Privacy Policy
            </a>
        </footer>
        </>
      )}
    </>
  );
}

export default App;