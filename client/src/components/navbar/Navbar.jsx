import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import EditableUsername from "./EditableUsername";
import "./Navbar.css";
import Login from "../login/Login";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Pobierz aktualnego użytkownika
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Nasłuchuj zmian auth
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const BookIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="book-icon"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );

  return (
    <nav className="nav">
      <div 
        className="logo" 
        onClick={() => window.location.reload()}
        style={{ cursor: 'pointer' }}
      >
        <BookIcon />
        <h2>BookTracker</h2>
      </div>

      <div className="nav-right">
        {user && <EditableUsername user={user} />}
        <Login />
      </div>
    </nav>
  );
}

export default Navbar;