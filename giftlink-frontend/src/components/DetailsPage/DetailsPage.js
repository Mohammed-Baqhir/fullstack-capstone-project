import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApiUrl } from '../../api';

function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gift, setGift] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('Please login to view gift details. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    async function fetchGift() {
      try {
        const response = await fetch(getApiUrl(`/api/gifts/${id}`), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Unable to fetch gift details');
        const data = await response.json();
        setGift(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchGift();
  }, [id, navigate]);

  if (error) return <main className="page-container"><p className="error">{error}</p></main>;
  if (!gift) return <main className="page-container"><p>Loading gift details...</p></main>;

  const comments = gift.comments || [];

  return (
    <main className="page-container details-layout">
      <img className="details-image" src={gift.image || gift.imageUrl || 'https://via.placeholder.com/500x350?text=GiftLink'} alt={gift.name || gift.title} />
      <section className="details-content">
        <h1>{gift.name || gift.title}</h1>
        <p><strong>Category:</strong> {gift.category}</p>
        <p><strong>Condition:</strong> {gift.condition}</p>
        <p><strong>Age:</strong> {gift.age}</p>
        <p><strong>Posted:</strong> {gift.postedDate || gift.date || 'Recently'}</p>
        <p><strong>Description:</strong> {gift.description}</p>
        <h2>Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment, index) => <p className="comment" key={index}>{comment.text || comment}</p>)
        ) : (
          <p>No comments yet.</p>
        )}
      </section>
    </main>
  );
}

export default DetailsPage;
