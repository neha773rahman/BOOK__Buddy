// src/components/AddBookForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AddBookForm = ({ onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    status: 'wishlist',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/books/', formData);
      alert('Book added successfully!');
      setFormData({ title: '', author: '', genre: '', status: 'wishlist' });

      if (onBookAdded) {
        onBookAdded(response.data); // optional callback to update book list
      }
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Something went wrong while adding the book.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a New Book</h2>

      <label>
        Title:
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </label>
      <br />

      <label>
        Author:
        <input type="text" name="author" value={formData.author} onChange={handleChange} required />
      </label>
      <br />

      <label>
        Genre:
        <input type="text" name="genre" value={formData.genre} onChange={handleChange} required />
      </label>
      <br />

      <label>
        Status:
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
          <option value="wishlist">Wishlist</option>
        </select>
      </label>
      <br />

      <button type="submit">Add Book</button>
    </form>
  );
};

export default AddBookForm;
