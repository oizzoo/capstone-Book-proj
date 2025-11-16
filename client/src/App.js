import { useEffect, useState } from "react";
import Navbar from "./components/navbar/Navbar";
import BooksList from "./components/BooksList";
import AddBookForm from "./components/AddBookForm";
import EditBookForm from "./components/EditBookForm";
import { supabase } from "./supabaseClient";
import { useAuth } from "./context/AuthContext";
import { getBooks, addBook } from "./api/books";

function App() {
  const { user, loading } = useAuth();
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);


  useEffect(() => {
    if (user) getBooks(user.id).then(setBooks);
  }, [user]);

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
    .eq("id", bookId)

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
        <EditBookForm
          book={editingBook}
          onCancel={() => setEditingBook(null)}
          onSave={async (updates) => {
            await handleEditBook(editingBook.id, updates);
            setEditingBook(null);
          }}
        />
      ) : (
        <>
          <AddBookForm onBookAdded={handleAddBook} />
          <BooksList 
            books={books}
            onEdit={setEditingBook}
            onDelete={handleDeleteBook}
          />
        </>
      )}
    </>
  );
}

export default App;
