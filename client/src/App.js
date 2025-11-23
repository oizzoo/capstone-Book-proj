import { useEffect, useState } from "react";
import Navbar from "./components/navbar/Navbar";
import BooksList from "./components/BooksList";
import BooksHeader from "./components/BooksHeader";
import AddBookModal from "./components/AddBookModal";
import EditBookForm from "./components/EditBookForm";
import { supabase } from "./supabaseClient";
import { getBooks, addBook } from "./api/books";
import { demoBooks } from "./demoData";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && !demoMode) {
      getBooks(user.id).then(data => {
        setBooks(data);
        setFilteredBooks(data);
      });
    } else if (demoMode) {
      setBooks([...demoBooks]); // Create a copy
      setFilteredBooks([...demoBooks]);
    }
  }, [user, demoMode]);

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
    if (demoMode) {
      // Demo mode: add to local state only
      const newBook = {
        ...bookData,
        id: Date.now(), // Temporary ID
        user_id: "demo",
        author: bookData.author || "Unknown",
        cover_url: bookData.cover_url || "https://via.placeholder.com/150x200?text=No+Cover"
      };
      setBooks(prevBooks => [newBook, ...prevBooks]);
      return;
    }

    // Real mode: save to Supabase
    const newBook = { ...bookData, user_id: user.id };
    await addBook(newBook);
    const updatedBooks = await getBooks(user.id);
    setBooks(updatedBooks);
  };

  const handleEditBook = async (bookId, updates) => {
    if (demoMode) {
      // Demo mode: update local state only
      setBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === bookId 
            ? { ...book, ...updates }
            : book
        )
      );
      return;
    }

    // Real mode: update in Supabase
    await supabase
      .from("books")
      .update(updates)
      .eq("id", bookId);

    const updated = await getBooks(user.id);
    setBooks(updated);
  };

  const handleDeleteBook = async (bookId) => {
    if (demoMode) {
      // Demo mode: remove from local state only
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      return;
    }

    // Real mode: delete from Supabase
    await supabase
      .from("books")
      .delete()
      .eq("id", bookId);

    const updated = await getBooks(user.id);
    setBooks(updated);
  };

  const handleEnterDemo = () => {
    setDemoMode(true);
  };

  const handleExitDemo = () => {
    setDemoMode(false);
    setBooks([]);
    setFilteredBooks([]);
    setActiveFilter('all');
  };

  if (loading) return <p>Loading...</p>;

  // Not logged in and not in demo mode
  if (!user && !demoMode) {
    return (
      <>
        <Navbar />
        <div style={{ 
          padding: "4rem 2rem", 
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            📚 Welcome to BookTracker!
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "2rem" }}>
            Track your reading journey, organize your library, and never forget a great book.
          </p>
          
          <div style={{ 
            display: "flex", 
            gap: "1rem", 
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <button
              onClick={handleEnterDemo}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.1rem",
                fontWeight: "600",
                border: "2px solid #e65b65",
                background: "white",
                color: "#e65b65",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#e65b65";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "white";
                e.target.style.color = "#e65b65";
              }}
            >
              🎭 View Demo
            </button>
          </div>

          <p style={{ 
            marginTop: "2rem", 
            fontSize: "0.95rem", 
            color: "#888" 
          }}>
            Sign in with Google to start tracking your own books
          </p>
        </div>

        {/* Footer with Privacy Policy */}
        <footer style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#666',
          borderTop: '1px solid #e0e0e0',
          marginTop: '4rem'
        }}>
          <a 
            href="https://oizzoo.github.io/capstone-Book-proj/privacy.html" 
            style={{ color: '#e65b65', textDecoration: 'none' }}
          >
            Privacy Policy
          </a>
        </footer>
      </>
    );
  }

  return (
    <>
      {editingBook ? (
        <>
          <Navbar demoMode={demoMode} onExitDemo={handleExitDemo} />
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
          <Navbar demoMode={demoMode} onExitDemo={handleExitDemo} />
          <div style={{ padding: "2rem" }}>
            {demoMode && (
              <div style={{
                background: "#fff3cd",
                border: "2px solid #ffc107",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                textAlign: "center"
              }}>
                <strong>🎭 Demo Mode</strong> - Try all features! Changes are temporary and won't be saved.
                <button
                  onClick={handleExitDemo}
                  style={{
                    marginLeft: "1rem",
                    padding: "0.5rem 1rem",
                    background: "#e65b65",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Exit Demo
                </button>
              </div>
            )}
            
            <BooksHeader
              onFilterChange={handleFilterChange}
              onAddClick={() => setShowAddModal(true)}
              activeFilter={activeFilter}
              demoMode={demoMode}
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
        </>
      )}
    </>
  );
}

export default App;