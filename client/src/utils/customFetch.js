// src/utils/customFetch.js
import { AuthContext } from '../context/AuthContext';
import React, { useContext } from 'react';
import jwtDecode from 'jwt-decode';

// Custom hook to use the customFetch function
const useCustomFetch = () => {
  const { auth, setAuth, logout, refreshAccessToken } = useContext(AuthContext);

  // The customFetch function
  const customFetch = async (url, options = {}, retry = true) => {
    // Set up headers with access token
    const headers = options.headers ? { ...options.headers } : {};
    if (auth.accessToken) {
      headers['Authorization'] = `Bearer ${auth.accessToken}`;
    }
    headers['Content-Type'] = 'application/json';

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401 && retry) {
        // Attempt to refresh the access token
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          // Retry the original request with the new access token
          headers['Authorization'] = `Bearer ${newAccessToken}`;
          const retryResponse = await fetch(url, { ...config, headers });
          return retryResponse;
        } else {
          // Refresh failed, logout the user
          logout();
          throw new Error('Authentication failed. Please log in again.');
        }
      }

      return response;
    } catch (error) {
      console.error('Error in customFetch:', error);
      throw error;
    }
  };

  return customFetch;
};

export default useCustomFetch;
