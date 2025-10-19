import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
 
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  console.log('ProtectedRoute - user:', user);
  
  if (!user) {
    console.log('ProtectedRoute - redirecting to /signin');
    return <Navigate to="/signin" replace />;
  }
  
  console.log('ProtectedRoute - allowing access');
  return <>{children}</>;
} 