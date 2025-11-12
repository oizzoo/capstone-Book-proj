import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './Login.css';

export default function Login() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://oizzoo.github.io/capstone-Book-proj'
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <button
      className="google-login-button"
      onClick={user ? handleLogout : handleLogin}
    >
      {user ? 'Logout' : 'Sign in'}
    </button>
  );
}
