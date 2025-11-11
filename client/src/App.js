import { useState, useEffect } from "react";
import BooksList from "./components/BooksList";
import AddBookForm from "./components/AddBookForm";

function App() {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setRefresh(false);
  }, [refresh]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <BooksList key={refresh ? "refresh" : "static"} />
      <AddBookForm onBookAdded={() => setRefresh(true)} />
    </div>
  );
}

export default App;
