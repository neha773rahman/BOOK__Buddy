import React, { useState } from 'react';
import axios from 'axios';

const BookForm = ({ onBookAdded }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const [isRead, setIsRead] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Make sure token is saved on login

    try {
      const response = await axios.post(
        '/api/books/',
        { title, author, pages, is_read: isRead },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        onBookAdded(); // refresh book list
        setTitle('');
        setAuthor('');
        setPages('');
        setIsRead(false);
      }
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Book title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Pages"
        value={pages}
        onChange={(e) => setPages(e.target.value)}
        required
      />
      <label>
        <input
          type="checkbox"
          checked={isRead}
          onChange={(e) => setIsRead(e.target.checked)}
        />
        Read?
      </label>
      <button type="submit">Add Book</button>
    </form>
  );
};

export default BookForm;
