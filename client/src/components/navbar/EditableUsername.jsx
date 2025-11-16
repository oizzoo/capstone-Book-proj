import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import './EditableUsername.css';

export default function EditableUsername({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchOrCreateUsername = async () => {
      if (!user) return;

      const userId = user.id;
      
      // Spróbuj pobrać username z tabeli users
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('id', userId)
        .single();

      if (data?.username) {
        // Znaleziono username - użyj go
        setUsername(data.username);
      } else {
        // Brak rekordu - stwórz nowy z domyślną nazwą
        const defaultName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
        
        // Wstaw nowy rekord do tabeli users
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ 
            id: userId, 
            username: defaultName 
          }]);

        if (insertError) {
          console.error('Error creating user record:', insertError);
          // Jeśli błąd, użyj domyślnej nazwy bez zapisywania
          setUsername(defaultName);
        } else {
          // Sukces - użyj domyślnej nazwy
          setUsername(defaultName);
        }
      }
    };

    fetchOrCreateUsername();
  }, [user]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setTempUsername(username);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!tempUsername.trim()) {
      alert('Username cannot be empty!');
      return;
    }

    if (tempUsername.trim() === username) {
      setIsEditing(false);
      return;
    }

    setLoading(true);

    const userId = user.id;

    // Update username w tabeli users
    const { error } = await supabase
      .from('users')
      .update({ username: tempUsername.trim() })
      .eq('id', userId);

    if (error) {
      console.error('Error updating username:', error);
      alert('Failed to update username: ' + error.message);
    } else {
      setUsername(tempUsername.trim());
      setIsEditing(false);
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempUsername('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="user-info editing">
        <span className="user-icon">👤</span>
        <input
          ref={inputRef}
          type="text"
          value={tempUsername}
          onChange={(e) => setTempUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          disabled={loading}
          className="username-input"
          maxLength={30}
        />
        {loading && <span className="loading-spinner">⏳</span>}
      </div>
    );
  }

  return (
    <div className="user-info" onClick={handleEdit} title="Click to edit username">
      <span className="user-icon">👤</span>
      <span className="user-name editable">{username}</span>
      <span className="edit-icon">✏️</span>
    </div>
  );
}