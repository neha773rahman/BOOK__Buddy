import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BookDetail({ bookId, onBack, onDelete }) {
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/books/${bookId}/`)
      .then(res => {
        setBook(res.data);
        setStatus(res.data.status);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching book:', err);
      });
  }, [bookId]);

  const handleStatusUpdate = () => {
    axios.patch(`http://localhost:8000/api/books/${bookId}/`, { status })
      .then(() => alert('Status updated!'))
      .catch(err => console.error('Status update failed:', err));
  };

  const handleAddReview = () => {
    axios.post('http://localhost:8000/api/reviews/', {
      book: bookId,
      rating,
      comment: review
    })
    .then(() => {
      alert('Review added!');
      setRating('');
      setReview('');
    })
    .catch(err => console.error('Error adding review:', err));
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:8000/api/books/${bookId}/`)
      .then(() => {
        alert('Book deleted!');
        onDelete();
      })
      .catch(err => console.error('Error deleting book:', err));
  };

  if (loading || !book) return <p>Loading book details...</p>;

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={onBack}>⬅ Back</button>

      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Genre:</strong> {book.genre}</p>

      <hr />

      <h5>Update Status</h5>
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select mb-2">
        <option value="wishlist">Wishlist</option>
        <option value="reading">Reading</option>
        <option value="completed">Completed</option>
      </select>
      <button className="btn btn-primary mb-3" onClick={handleStatusUpdate}>Update Status</button>

      <hr />

      <h5>Add Review</h5>
      <input
        type="number"
        min="1"
        max="5"
        placeholder="Rating (1-5)"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="form-control mb-2"
      />
      <textarea
        placeholder="Write a review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="form-control mb-2"
      />
      <button className="btn btn-success" onClick={handleAddReview}>Submit Review</button>

      <hr />

      <button className="btn btn-danger" onClick={handleDelete}>Delete Book</button>
    </div>
  );
}

export default BookDetail;
