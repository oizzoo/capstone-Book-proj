import { useState, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import BooksList from "./components/BooksList";
import AddBookForm from "./components/AddBookForm";
import EditBookForm from "./components/EditBookForm";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [selectedBook, setSelectedBook] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem("token"));
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleBookUpdated = () => {
    setSelectedBook(null);
    setRefresh(!refresh);
  };

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div
          style={{
            padding: "4rem 2rem",
            textAlign: "center",
            fontFamily: "sans-serif",
            color: "#444",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            Log in to start tracking your books!
          </h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "#666" }}>
            Sign in with Google to add, edit, and organize your reading list.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        {!selectedBook ? (
          <>
            <AddBookForm onBookAdded={() => setRefresh(!refresh)} />

            <BooksList
              key={refresh}
              onEdit={setSelectedBook}
              onDelete={() => setRefresh(!refresh)}
            />
          </>
        ) : (
          <EditBookForm
            book={selectedBook}
            onCancel={() => setSelectedBook(null)}
            onUpdated={handleBookUpdated}
          />
        )}
      </div>
    </>
  );
}

export default App;