import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../api';

function SearchPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ name: '', category: '', condition: '', age: '' });
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    try {
      const response = await fetch(getApiUrl(`/api/search?${params.toString()}`));
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="page-container">
      <h1>Search Gifts</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <input name="name" placeholder="Search text" value={filters.name} onChange={handleChange} />
        <input name="category" placeholder="Category" value={filters.category} onChange={handleChange} />
        <input name="condition" placeholder="Condition" value={filters.condition} onChange={handleChange} />
        <input name="age" placeholder="Age" value={filters.age} onChange={handleChange} />
        <button type="submit">Search</button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="gift-grid">
        {results.map((gift) => {
          const id = gift._id || gift.id;
          return (
            <div className="gift-card" key={id} onClick={() => navigate(`/details/${id}`)}>
              <img src={gift.image || gift.imageUrl || 'https://via.placeholder.com/300x200?text=GiftLink'} alt={gift.name || gift.title} />
              <h3>{gift.name || gift.title}</h3>
              <p>{gift.category}</p>
              <p>{gift.condition}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default SearchPage;
