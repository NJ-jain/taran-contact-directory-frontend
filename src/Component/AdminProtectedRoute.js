import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
    const adminToken = localStorage.getItem('adminAuthorization');
    
    if (!adminToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;