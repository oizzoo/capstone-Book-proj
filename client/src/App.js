import { useEffect, useState } from "react";
import Navbar from "./components/navbar/Navbar";
import BooksList from "./components/BooksList";
import AddBookForm from "./components/AddBookForm";
import { useAuth } from "./context/AuthContext";
import { getBooks, addBook } from "./api/books";

function App() {
  const { user, loading } = useAuth();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (user) getBooks(user.id).then(setBooks);
  }, [user]);

  const handleAddBook = async (bookData) => {
    const newBook = { ...bookData, user_id: user.id };
    await addBook(newBook);
    const updatedBooks = await getBooks(user.id);
    setBooks(updatedBooks);
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
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <AddBookForm onBookAdded={handleAddBook} />
        <BooksList books={books} />
      </div>
    </>
  );
}

export default App;
