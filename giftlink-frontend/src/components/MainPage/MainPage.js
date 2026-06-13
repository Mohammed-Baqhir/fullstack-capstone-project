import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../api';

function MainPage() {
  const [gifts, setGifts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGifts() {
      try {
        const response = await fetch(getApiUrl('/api/gifts'));
        if (!response.ok) throw new Error('Unable to fetch gifts');
        const data = await response.json();
        setGifts(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchGifts();
  }, []);

  return (
    <main className="page-container">
      <h1>Available Gifts</h1>
      {error && <p className="error">{error}</p>}
      <div className="gift-grid">
        {gifts.map((gift) => {
          const id = gift._id || gift.id;
          return (
            <div className="gift-card" key={id} onClick={() => navigate(`/details/${id}`)}>
              <img src={gift.image || gift.imageUrl || 'https://via.placeholder.com/300x200?text=GiftLink'} alt={gift.name || gift.title} />
              <h3>{gift.name || gift.title}</h3>
              <p>{gift.category}</p>
              <p>Posted: {gift.postedDate || gift.date || 'Recently'}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default MainPage;
