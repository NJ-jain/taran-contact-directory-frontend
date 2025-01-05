import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Component/Login';
import Register from './Component/Register';
import ProtectedRoute from './Component/ProtectedRoute'; // Ensure this path is correct
import Dashboard from './Component/Dashboard'; // Import the component you want to protect
import Details from './Component/Details';
import Profile from './Component/Profile';

function App() {
  return (
    <Router>
      <div className=" w-full relative overflow-hidden">
        <Routes>
          <Route path="/" index element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;