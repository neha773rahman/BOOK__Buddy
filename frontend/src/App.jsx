// App.jsx
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import BookManager from './components/BookManager';
import BookDetail from './components/BookDetail';

// Wrapper for extracting bookId and passing props to BookDetail
function BookDetailWrapper() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  return (
    <BookDetail
      bookId={bookId}
      onBack={() => navigate('/', { state: { showList: true } })}
      onDelete={() => navigate('/', { state: { showList: true } })}
    />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookManager />} />
        <Route path="/book/:bookId" element={<BookDetailWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;

