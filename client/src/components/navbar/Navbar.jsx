import "./Navbar.css";
import Login from "../login/Login";

function Navbar() {
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
      <div className="logo" onClick={() => window.location.href = "capstone-Book-proj/"}>
        <BookIcon />
        <h2>BookTracker</h2>
      </div>

      <ul className="links">
        <li><a href="#to-read">To Read</a></li>
        <li><a href="#reading">Reading</a></li>
        <li><a href="#read">Read</a></li>
        <li><Login /></li>
      </ul>
    </nav>
  );
}

export default Navbar;