import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookDetail = ({ bookId, onBack, onDelete }) => {
  const [book, setBook] = useState(null);
  const [progress, setProgress] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState('');
  const [history, setHistory] = useState([]);

  const [editProgress, setEditProgress] = useState(false);
  const [editReview, setEditReview] = useState(false);

  useEffect(() => {
    // 📘 Fetch book details
    axios.get(`http://localhost:8000/api/books/${bookId}/`)
      .then(res => {
        setBook(res.data);
        setProgress(res.data.progress?.percent_completed || '');
        setNotes(res.data.review?.notes || '');
        setRating(res.data.review?.rating || '');
      })
      .catch(err => console.error(err));

    // 📈 Fetch progress history
    axios.get(`http://localhost:8000/api/books/${bookId}/progress-history/`)
      .then(res => {
        setHistory(res.data);
      })
      .catch(err => console.error("❌ Failed to load progress history", err));
  }, [bookId]);

  const updateProgress = () => {
    axios.patch(`http://localhost:8000/api/progress/${bookId}/`, {
      book: bookId,
      percent_completed: parseInt(progress),
    })
      .then(() => {
        alert("Progress updated");
        setEditProgress(false);
      })
      .catch(() => alert("Failed to update progress"));
  };

  const updateReview = () => {
    axios.patch(`http://localhost:8000/api/review/${bookId}/`, {
      book: bookId,
      notes,
      rating: parseInt(rating),
    })
      .then(() => {
        alert("Review updated");
        setEditReview(false);
      })
      .catch(() => alert("Failed to update review"));
  };

  const deleteBook = () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      axios.delete(`http://localhost:8000/api/books/${bookId}/`)
        .then(() => {
          alert("Book deleted");
          onBack();
          onDelete();
        })
        .catch(() => alert("Failed to delete book"));
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
      <h3>📖 {book.title} - Details</h3>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Status:</strong> {book.status}</p>

      {/* Progress Section */}
      <div>
        <h4>📈 Progress</h4>
        {editProgress ? (
          <>
            <input
              type="number"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              min="0"
              max="100"
            />
            <button onClick={updateProgress}>Save</button>
            <button onClick={() => setEditProgress(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p>{progress ? `${progress}% completed` : 'No progress yet'}</p>
            <button onClick={() => setEditProgress(true)}>✏️ Edit</button>
          </>
        )}
      </div>

      {/* Progress History Section */}
      <div style={{ marginTop: '20px' }}>
        <h4>📅 Progress History</h4>
        {history.length > 0 ? (
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                {new Date(entry.updated_at).toLocaleDateString()} - {entry.percent_completed}%
              </li>
            ))}
          </ul>
        ) : (
          <p>No history available.</p>
        )}
      </div>

      {/* Review Section */}
      <div style={{ marginTop: '20px' }}>
        <h4>📝 Review</h4>
        {book.status !== 'completed' ? (
          <p style={{ fontStyle: 'italic', color: 'gray' }}>
            📌 You can only review a completed book.
          </p>
        ) : editReview ? (
          <>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write review"
            />
            <br />
            <label>Rating:</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="">--</option>
              {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <br />
            <button onClick={updateReview}>Save</button>
            <button onClick={() => setEditReview(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Review:</strong> {notes || 'No review yet'}</p>
            <p><strong>Rating:</strong> {rating || 'No rating yet'}</p>
            <button onClick={() => setEditReview(true)}>✏️ Edit</button>
          </>
        )}
      </div>

      {/* Delete + Back */}
      <button onClick={deleteBook} style={{ color: 'red', marginTop: '20px' }}>Delete Book</button>
      <br />
      <button onClick={onBack} style={{ marginTop: '10px' }}>← Back</button>
    </div>
  );
};

export default BookDetail;
