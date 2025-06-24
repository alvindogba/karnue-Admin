import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  
  // Check if user is authenticated by looking for the token in localStorage
  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  };

  if (!isAuthenticated()) {
    // Redirect to the login page if not authenticated
    // Store the location they were trying to access so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Return the protected component if authenticated
  return children;
};

export default ProtectedRoute;
