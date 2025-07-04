import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BookDetail({ bookId, onBack, onDelete }) {
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [progressHistory, setProgressHistory] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/books/${bookId}/`).then(res => {
      setBook(res.data);
      setStatus(res.data.status);
      setTotalPages(res.data.total_pages || '');
      setLoading(false);
    }).catch(err => console.error('Error fetching book:', err));

    axios.get(`http://localhost:8000/api/books/${bookId}/progress-history/`).then(res => {
      setProgressHistory(res.data);
    }).catch(err => console.error('Error fetching progress:', err));
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
      notes: review
    }).then(() => {
      alert('Review added!');
      setRating('');
      setReview('');
      return axios.get(`http://localhost:8000/api/books/${bookId}/`);
    }).then(res => {
      setBook(res.data);
    }).catch(err => console.error('Error adding review:', err));
  };

  const handleTotalPagesUpdate = () => {
    axios.patch(`http://localhost:8000/api/books/${bookId}/`, { total_pages: totalPages })
      .then(() => alert('Total pages updated!'))
      .catch(err => console.error('Error updating total pages:', err));
  };

  const handleAddProgress = () => {
    if (!totalPages) {
      alert('Please set total pages first.');
      return;
    }
    const percentCompleted = Math.min(100, Math.round((pagesRead / totalPages) * 100));
    axios.post('http://localhost:8000/api/progress/', {
      book: bookId,
      percent_completed: percentCompleted,
    }).then(() => {
      alert('Progress updated!');
      setPagesRead('');
      return axios.get(`http://localhost:8000/api/books/${bookId}/progress-history/`);
    }).then(res => setProgressHistory(res.data))
      .catch(err => console.error('Error updating progress:', err));
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:8000/api/books/${bookId}/`).then(() => {
      alert('Book deleted!');
      onDelete();
    }).catch(err => console.error('Error deleting book:', err));
  };

  if (loading || !book) return <p>Loading book details...</p>;

  return (
    <div className="container mt-4">
      <button className="btn btn-outline-secondary mb-3" onClick={onBack}>⬅ Back</button>

      <div className="card shadow p-4">
        <h2 className="mb-3">{book.title}</h2>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Genre:</strong> {book.genre}</p>
      </div>

      <div className="card shadow p-4 mt-4">
        <h5 className="mb-3">Update Status</h5>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select mb-2">
          <option value="wishlist">Wishlist</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>
        <button className="btn btn-primary" onClick={handleStatusUpdate}>Update Status</button>
      </div>

      <div className="card shadow p-4 mt-4">
        <h5 className="mb-3">Set Total Pages</h5>
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Enter total pages"
          value={totalPages}
          onChange={(e) => setTotalPages(e.target.value)}
        />
        <button className="btn btn-warning" onClick={handleTotalPagesUpdate}>Save Total Pages</button>
      </div>

      <div className="card shadow p-4 mt-4">
        <h5 className="mb-3">Update Reading Progress</h5>
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Enter pages read"
          value={pagesRead}
          onChange={(e) => setPagesRead(e.target.value)}
        />
        <button className="btn btn-info" onClick={handleAddProgress}>Add Progress</button>
        <div className="mt-3">
          <h6>Progress History:</h6>
          {progressHistory.length === 0 ? (
            <p className="text-muted">No progress yet</p>
          ) : (
            <ul className="list-group">
              {progressHistory.map((entry) => (
                <li className="list-group-item" key={entry.id}>
                  {entry.percent_completed}% completed on {new Date(entry.updated_at).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card shadow p-4 mt-4">
        <h5 className="mb-3">Add Review</h5>
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
        <button className="btn btn-success mb-3" onClick={handleAddReview}>Submit Review</button>

        {book.review && (book.review.notes || book.review.rating) ? (
          <div className="mt-3">
            <h6>Review:</h6>
            {book.review.rating && <p><strong>Rating:</strong> {book.review.rating}</p>}
            {book.review.notes && <p><strong>Notes:</strong> {book.review.notes}</p>}
            <p className="text-muted"><small>{new Date(book.review.created_at).toLocaleString()}</small></p>
          </div>
        ) : (
          <p className="text-muted">No review yet</p>
        )}
      </div>

      <div className="text-end mt-4">
        <button className="btn btn-danger" onClick={handleDelete}>Delete Book</button>
      </div>
    </div>
  );
}

export default BookDetail;
