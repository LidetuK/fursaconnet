
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const useDashboardState = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [packageType, setPackageType] = useState<string>('enterprise'); // Temporarily set to enterprise for all users
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [userType, setUserType] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      // Set userType based on user data from auth context
      if (user.is_admin) {
        setUserType('admin');
      } else {
        setUserType('sme'); // Default for regular users
      }
    }
    
    // Get package information from location state - temporarily disabled
    // if (location.state?.packageType) {
    //   setPackageType(location.state.packageType);
    //   localStorage.setItem('skilllink_package', location.state.packageType);
    // }
  }, [location, user]);

  return {
    packageType,
    activeSection,
    setActiveSection,
    userType
  };
};
