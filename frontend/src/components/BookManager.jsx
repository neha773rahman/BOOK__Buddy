import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


function BookManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState(location.state?.showList ? 'list' : 'form');

  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    status: 'wishlist'
  });

 
  useEffect(() => {
    if (view === 'list') {
      axios.get('http://localhost:8000/api/books/')
        .then(res => setBooks(res.data))
        .catch(err => console.error(err));
    }
  }, [view]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8000/api/books/', JSON.stringify(formData), {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        alert('Book added!');
        setFormData({ title: '', author: '', genre: '', status: 'wishlist' });
      })
      .catch(err => {
        console.error('Error:', err.response?.data || err.message);
        alert('Failed to add book.');
      });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{view === 'form' ? 'Add New Book' : 'Book List'}</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setView(view === 'form' ? 'list' : 'form')}
        >
          {view === 'form' ? 'View Book List' : 'Add New Book'}
        </button>
      </div>

      {view === 'form' ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Title</label>
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
            <label>Author</label>
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
            <label>Genre</label>
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
            <label>Status</label>
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
          <button type="submit" className="btn btn-success">Add Book</button>
        </form>
      ) : (
        <div className="row">
          {books.map((book) => (
            <div className="col-md-4 mb-3" key={book.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
                  <p><strong>Genre:</strong> {book.genre}</p>
                  <span className="badge bg-info text-dark text-capitalize">{book.status}</span>

                  <button 
                    className="btn btn-sm btn-outline-primary mt-2"
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookManager;
