import React from "react";
import Login from "./login/Login";

export default function HomePage({ isLoggedIn }) {
  return (
    <div className="homepage-container" style={{ textAlign: "center", marginTop: "4rem" }}>
      {isLoggedIn ? (
        <>
          <h1>Your Reading Hub: Manage Your Books, Plan Your Journey!</h1>
        </>
      ) : (
        <>
          <h1>Log in to start tracking your books!</h1>
          <p style={{ fontSize: "1.2rem", color: "#555", margin: "1rem 0" }}>
            Sign in with Google to add, edit, and organize your reading list.
          </p>
          <Login />
        </>
      )}
    </div>
  );
}