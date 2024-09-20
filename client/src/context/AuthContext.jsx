// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap around the app
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Initialize state from localStorage
  const [auth, setAuth] = useState({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: localStorage.getItem('accessToken')
      ? jwtDecode(localStorage.getItem('accessToken'))
      : null,
  });

  // Function to handle logout
  const logout = () => {
    setAuth({ accessToken: null, refreshToken: null, user: null });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  // Function to handle token refresh
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: auth.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const { accessToken, refreshToken } = data;

      // Update state and localStorage with new tokens
      setAuth((prev) => ({
        ...prev,
        accessToken,
        refreshToken: refreshToken || prev.refreshToken, // Some APIs return a new refresh token
        user: jwtDecode(accessToken),
      }));
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      return accessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      logout();
      return null;
    }
  };

  // Effect to automatically refresh token before it expires
  useEffect(() => {
    if (auth.accessToken) {
      const { exp } = jwtDecode(auth.accessToken);
      const expiresIn = exp * 1000 - Date.now() - 60000; // Refresh 1 minute before expiry

      const timeout = setTimeout(() => {
        refreshAccessToken();
      }, expiresIn);

      return () => clearTimeout(timeout);
    }
  }, [auth.accessToken]); // Re-run when accessToken changes

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
