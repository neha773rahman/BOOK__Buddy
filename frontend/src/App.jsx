

import React, { useState } from 'react';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';

function App() {
  const [newBook, setNewBook] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>📖 Book Buddy</h1>
      <AddBookForm onBookAdded={setNewBook} />
      <hr />
      <BookList key={newBook?.id || 0} />
    </div>
  );
}

export default App;
