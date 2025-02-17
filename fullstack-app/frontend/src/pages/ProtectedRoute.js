//ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, requiredRole, children, redirectPath = '/login' }) => {
  const userRole = localStorage.getItem('userRole'); // Получение роли

  if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
