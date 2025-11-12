import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import "./Login.css";

function Login() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem("token"));
  
    const login = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        const accessToken = tokenResponse.access_token;
  
        try {
          const res = await fetch("http://localhost:3001/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: accessToken })
          });
  
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem("token", data.token);
            setIsLoggedIn(true);
            window.location.reload();
          }
        } catch (err) {
          console.error("Login error:", err);
        }
      },
      onError: () => console.error("Login failed"),
    });
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      window.location.reload();
    };
  
    return isLoggedIn ? (
      <button onClick={handleLogout} className="google-login-button logout">
        Logout
      </button>
    ) : (
      <button onClick={() => login()} className="google-login-button">
        Sign in
      </button>
    );
}

export default Login;