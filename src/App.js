import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Component/Login';
import Register from './Component/Register';
import AdminLogin from './Component/AdminLogin';
import AdminRegister from './Component/AdminRegister';
import ProtectedRoute from './Component/ProtectedRoute';
import Dashboard from './Component/Dashboard';
import Details from './Component/Details';
import Profile from './Component/Profile';
import Admin from './Component/admin';
import AdminProtectedRoute from './Component/AdminProtectedRoute';
import ForgotPasswordEmail from './Component/ForgotPasswordEmail';
import ForgotPasswordOTP from './Component/ForgotPasswordOTP';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans antialiased">
        <Routes>
          <Route path="/" index element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordEmail />} />
          <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path='/details/:id' element={<Details />} />
          <Route
            exact
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
                <AdminProtectedRoute>
                    <Admin />
                </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
                <AdminProtectedRoute>
                    <Admin />
                </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/members"
            element={
                <AdminProtectedRoute>
                    <Admin />
                </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/members/:userId"
            element={
                <AdminProtectedRoute>
                    <Admin />
                </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
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