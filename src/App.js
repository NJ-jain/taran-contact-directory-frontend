import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Component/Login';
import Register from './Component/Register';
import AdminLogin from './Component/AdminLogin';
import AdminRegister from './Component/AdminRegister';
import ProtectedRoute from './Component/ProtectedRoute'; // Ensure this path is correct
import Dashboard from './Component/Dashboard'; // Import the component you want to protect
import Details from './Component/Details';
import Profile from './Component/Profile';
import Admin from './Component/admin';
import AdminProtectedRoute from './Component/AdminProtectedRoute';

function App() {
  return (
    <Router>
      <div className=" w-full relative overflow-hidden">
        <Routes>
          <Route path="/" index element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path='/details/:id' element={<Details />} />
          <Route
            exact
            path="/profile" // Define the route for the "aftersignup" page
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } // Render the "aftersignup" page component
          />
          <Route
            path="/admin"
            element={
                <AdminProtectedRoute>
                    <Admin />
                </AdminProtectedRoute>
            }
          />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;