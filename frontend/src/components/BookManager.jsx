import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function BookManager() {
  const navigate = useNavigate();
  const location = useLocation();

  const [view, setView] = useState(location.state?.showList ? 'list' : 'form');
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    status: 'wishlist',
  });

  const [filterStatus, setFilterStatus] = useState('');
  const [searchGenre, setSearchGenre] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/books/')
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8000/api/books/', formData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        alert('Book added!');
        setFormData({ title: '', author: '', genre: '', status: 'wishlist' });
        setBooks([...books, res.data]);
        setView('list');
      })
      .catch((err) => {
        console.error('Error:', err.response?.data || err.message);
        alert('Failed to add book.');
      });
  };

  const filteredBooks = books.filter((book) => {
    const matchesStatus = !filterStatus || book.status === filterStatus;
    const matchesGenre = book.genre.toLowerCase().includes(searchGenre.toLowerCase());
    return matchesStatus && matchesGenre;
  });

  const wishlistCount = books.filter(book => book.status === 'wishlist').length;
  const readingCount = books.filter(book => book.status === 'reading').length;
  const completedCount = books.filter(book => book.status === 'completed').length;

  return (
    <div className="container mt-4">
      {view === 'list' && (
        <>
          <h2 className="text-center mb-2" style={{ fontWeight: 'bold', background: 'linear-gradient(to right, #4facfe, #00f2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            📚 Welcome to Book Buddy, Neha!
          </h2>
          <p className="text-center mb-4 fst-italic text-muted">“A reader lives a thousand lives before he dies.”</p>
        </>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold" style={{ color: '#333' }}>{view === 'form' ? 'Add New Book' : '📖 Book List'}</h4>
        <button
          className="btn btn-outline-dark"
          onClick={() => setView(view === 'form' ? 'list' : 'form')}
        >
          {view === 'form' ? 'View Book List' : 'Add New Book'}
        </button>
      </div>

      {view === 'form' ? (
        <div className="d-flex justify-content-center">
          <div className="card shadow p-4 mb-4 w-100" style={{ background: 'linear-gradient(to right, #ece9e6, #ffffff)', maxWidth: '600px' }}>
            <form onSubmit={handleSubmit} className="w-100">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  name="author"
                  className="form-control"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Genre</label>
                <input
                  type="text"
                  name="genre"
                  className="form-control"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="wishlist">Wishlist</option>
                  <option value="reading">Reading</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success w-100">Add Book</button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card text-center text-white" style={{ background: 'linear-gradient(135deg, #00c6ff, #0072ff)' }}>
                <div className="card-body">
                  <h5 className="card-title">📌 Wishlist</h5>
                  <p className="display-6">{wishlistCount}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center text-white" style={{ background: 'linear-gradient(135deg, #ffafbd, #ffc3a0)' }}>
                <div className="card-body">
                  <h5 className="card-title">📖 Reading</h5>
                  <p className="display-6">{readingCount}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center text-white" style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}>
                <div className="card-body">
                  <h5 className="card-title">✅ Completed</h5>
                  <p className="display-6">{completedCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label>Filter by Status:</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="wishlist">Wishlist</option>
                <option value="reading">Reading</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="col-md-6">
              <label>Search by Genre:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter genre to search..."
                value={searchGenre}
                onChange={(e) => setSearchGenre(e.target.value)}
              />
            </div>
          </div>

          <div className="row row-cols-1 row-cols-md-3 g-4">
            {filteredBooks.map((book) => (
              <div className="col" key={book.id}>
                <div className="card h-100 shadow-sm" style={{ background: 'linear-gradient(to top left, #ffffff, #e0f7fa)' }}>
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <span className={`badge text-capitalize px-2 py-1 ${
                      book.status === 'wishlist'
                        ? 'bg-warning text-dark'
                        : book.status === 'reading'
                        ? 'bg-primary'
                        : 'bg-success'
                    }`}>
                      {book.status}
                    </span>
                    {book.review ? (
                      <div className="mt-2">
                        <p><strong>Rating:</strong> ⭐ {book.review.rating}</p>
                        <p><em>{book.review.notes}</em></p>
                      </div>
                    ) : (
                      <p className="text-muted mt-2">No review yet</p>
                    )}
                    <button
                      className="btn btn-outline-primary btn-sm mt-3"
                      onClick={() => navigate(`/book/${book.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default BookManager;
