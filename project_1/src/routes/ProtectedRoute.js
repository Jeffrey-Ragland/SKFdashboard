import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = async () => {
    try {
      const response = await axios.get('http://localhost:3001/dashmain');
      return response.data === 'loggedin';
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return (
    <Route
      {...rest}
      element={isAuthenticated() ? <Element /> : <Navigate to="/" />}
    />
  );
};

export default ProtectedRoute;
