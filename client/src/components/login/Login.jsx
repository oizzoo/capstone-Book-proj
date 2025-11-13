import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './Login.css';

export default function Login() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://oizzoo.github.io/capstone-Book-proj'
        }
      });
      if (error) {
        console.error('Login error:', error.message);
        alert(`Login error: ${error.message}`);
      } else {
        console.log('Login redirect data:', data);
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
    }
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
