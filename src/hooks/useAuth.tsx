
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getCurrentUser } from '@/lib/api';

interface AuthContextType {
  user: any | null;
  userType: string | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userType: null,
  signOut: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    console.log('=== FETCH USER CALLED ===');
    try {
      // First check localStorage for immediate user data
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      console.log('LocalStorage check:', {
        user: storedUser ? 'Present' : 'Missing',
        token: storedToken ? 'Present' : 'Missing'
      });
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Set userType based on is_admin flag
        if (userData.is_admin) {
          setUserType('admin');
        } else {
          // For regular users, default to 'sme' for now
          setUserType('sme');
        }
        console.log('User loaded from localStorage:', userData);
      }
      
      // Then try to get fresh data from backend
      console.log('Calling getCurrentUser from backend...');
      const u = await getCurrentUser();
      console.log('Backend getCurrentUser result:', u);
      
      if (u) {
        setUser(u);
        // Set userType based on is_admin flag
        if (u.is_admin) {
          setUserType('admin');
        } else {
          // For regular users, default to 'sme' for now
          setUserType('sme');
        }
        console.log('User loaded from backend:', u);
      } else {
        console.log('No user returned from backend');
      }
    } catch (error) {
      console.error('=== FETCH USER ERROR ===');
      console.error('Error fetching user:', error);
      // If backend fails, keep localStorage user
    }
    console.log('=== FETCH USER COMPLETE ===');
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signOut = async () => {
    try {
      // Call backend logout endpoint to clear cookie
      await fetch('https://fursaconnet-production.up.railway.app/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error calling logout endpoint:', error);
    }
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear state
    setUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ user, userType, signOut, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
