import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../api';

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ firstName: '', lastName: '', username: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    async function fetchProfile() {
      try {
        const response = await fetch(getApiUrl('/api/auth/profile'), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Unable to fetch profile');
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    setError('');
    setMessage('');
    const token = sessionStorage.getItem('token');

    try {
      const response = await fetch(getApiUrl('/api/auth/update'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ firstName: profile.firstName, lastName: profile.lastName, username: profile.username })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Update failed');
      sessionStorage.setItem('username', profile.username || profile.firstName);
      setMessage('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="form-page">
      <section className="auth-form">
        <h1>My Profile</h1>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <input name="firstName" value={profile.firstName} onChange={handleChange} disabled={!editMode} />
        <input name="lastName" value={profile.lastName} onChange={handleChange} disabled={!editMode} />
        <input name="username" value={profile.username} onChange={handleChange} disabled={!editMode} />
        <input name="email" value={profile.email} disabled />
        {editMode ? (
          <button onClick={handleUpdate}>Save</button>
        ) : (
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        )}
      </section>
    </main>
  );
}

export default ProfilePage;
