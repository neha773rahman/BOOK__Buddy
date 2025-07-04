import { useParams, useNavigate } from 'react-router-dom';
import BookDetail from './components/BookDetail';

function BookDetailWrapper() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  return (
    <BookDetail
      bookId={bookId}
      onBack={() => navigate('/?view=list')}  
      onDelete={() => navigate('/?view=list')} 
    />
  );
}
