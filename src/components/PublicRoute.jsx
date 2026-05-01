import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ background: '#faf7f2' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" 
             style={{ borderColor: '#965f21', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}