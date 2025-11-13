import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './Login.css';

export default function Login() {
  const [user, setUser] = useState(null);
  const [showSecretLogin, setShowSecretLogin] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [holdTimer, setHoldTimer] = useState(null);

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
    setShowSecretLogin(false);
    setSecretCode('');
  };

  // Secret VIP Login
  const handleSecretLogin = async () => {
    if (secretCode.toLowerCase() === 'china') {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: process.env.REACT_APP_VIP_EMAIL,
          password: process.env.REACT_APP_VIP_PASSWORD
        });
        
        if (error) {
          alert('Secret login failed: ' + error.message);
        } else {
          setUser(data.user);
          setShowSecretLogin(false);
          setSecretCode('');
        }
      } catch (err) {
        console.error('Secret login error:', err);
        alert('Something went wrong!');
      }
    } else {
      alert('Invalid code!');
    }
  };

  // Long press handlers
  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setShowSecretLogin(true);
    }, 5000); // 5 seconds
    setHoldTimer(timer);
  };

  const handleMouseUp = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  const handleMouseLeave = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  return (
    <>
      <button
        className="google-login-button"
        onClick={user ? handleLogout : handleLogin}
        onMouseDown={!user ? handleMouseDown : undefined}
        onMouseUp={!user ? handleMouseUp : undefined}
        onMouseLeave={!user ? handleMouseLeave : undefined}
        onTouchStart={!user ? handleMouseDown : undefined}
        onTouchEnd={!user ? handleMouseUp : undefined}
      >
        {user ? 'Logout' : 'Sign in'}
      </button>

      {showSecretLogin && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 9999
        }}>
          <h3 style={{ marginTop: 0 }}>VIP Access 🔐</h3>
          <input
            type="text"
            placeholder="Enter secret code"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSecretLogin()}
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              marginBottom: '1rem',
              width: '100%',
              border: '2px solid #e65b65',
              borderRadius: '4px'
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleSecretLogin}
              style={{
                padding: '0.5rem 1rem',
                background: '#e65b65',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              Login
            </button>
            <button
              onClick={() => {
                setShowSecretLogin(false);
                setSecretCode('');
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#ccc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}