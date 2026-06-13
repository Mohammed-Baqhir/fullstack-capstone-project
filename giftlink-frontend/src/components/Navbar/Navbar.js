import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(sessionStorage.getItem('username'));

  useEffect(() => {
    const updateUsername = () => setUsername(sessionStorage.getItem('username'));
    window.addEventListener('storage', updateUsername);
    return () => window.removeEventListener('storage', updateUsername);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    setUsername(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link className="logo" to="/">GiftLink</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/app">Gifts</Link>
        <Link to="/search">Search</Link>
        {username ? (
          <>
            <Link to="/profile">Profile</Link>
            <span className="username">Welcome, {username}</span>
            <button className="nav-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
