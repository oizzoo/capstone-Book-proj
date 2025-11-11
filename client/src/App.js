import { useState, useEffect } from "react";
import BooksList from "./components/BooksList";
import AddBookForm from "./components/AddBookForm";
import EditBookForm from "./components/EditBookForm";


function App() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleBookUpdated = () => {
    setSelectedBook(null);
    setRefresh(!refresh);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      {!selectedBook ? (
        <>
          <BooksList
            key={refresh}
            onEdit={setSelectedBook}
            onDelete={() => setRefresh(!refresh)}
          />
          <AddBookForm onBookAdded={() => setRefresh(!refresh)} />
        </>
      ) : (
        <EditBookForm
          book={selectedBook}
          onCancel={() => setSelectedBook(null)}
          onUpdated={handleBookUpdated}
        />
      )}
    </div>
  );
}

export default App;
