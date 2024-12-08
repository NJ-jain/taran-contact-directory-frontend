import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  debugger
  const token = localStorage.getItem('authorization');

  if (!token) {
    localStorage.clear();
    return <Navigate to='/login' />
  }

  return children;
}

export default ProtectedRoute;