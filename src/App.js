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
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route path='/details/:id' element={<Details />} />
          {/* <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} /> */}
          {/* <Route
            exact
            path="/dashboard" // Define the route for the "aftersignup" page
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } // Render the "aftersignup" page component
          /> */}
          <Route
            exact
            path="/profile" // Define the route for the "aftersignup" page
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } // Render the "aftersignup" page component
          />
          {/* <Route path="/profile" element={<ProtectedRoute element={Profile} />} /> */}
          <Route path='/props' element={<Profile />} />
          {/* Add more routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;