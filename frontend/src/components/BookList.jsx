import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookDetail from './BookDetail';

function BookList() {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [genre, setGenre] = useState('');

  const fetchBooks = () => {
    let url = 'http://localhost:8000/api/books/';
    if (genre) {
      url += `?genre=${genre}`;
    }

    axios.get(url)
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBooks();
  }, [genre]);

  return (
    <div>
      <h2>📚 Book List</h2>

      {/* Genre filter dropdown */}
      <label>Filter by Genre: </label>
      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="">All</option>
        <option value="Fiction">Fiction</option>
        <option value="Romance">Romance</option>
        <option value="Thriller">Thriller</option>
        <option value="Sci-Fi">Sci-Fi</option>
        {/* Add more genres if needed */}
      </select>

      <ul>
        {books.map(book => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author} ({book.status})
            <button onClick={() => setSelectedBookId(book.id)} style={{ marginLeft: '10px' }}>
              Details
            </button>
          </li>
        ))}
      </ul>

      {/* Show details view if a book is selected */}
      {selectedBookId && (
        <BookDetail
          bookId={selectedBookId}
          onBack={() => setSelectedBookId(null)}
          onDelete={fetchBooks}
        />
      )}
    </div>
  );
}

export default BookList;
