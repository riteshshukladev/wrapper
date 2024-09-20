// src/pages/Dashboard.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import useCustomFetch from '../utils/customFetch';

const Dashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const customFetch = useCustomFetch();

  // Example: Fetch user-specific data
  // const fetchUserData = async () => {
  //   try {
  //     const response = await customFetch(`${import.meta.env.VITE_API_URL}/api/user/data`); // Replace with your endpoint
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch user data');
  //     }
  //     const data = await response.json();
  //     console.log('User Data:', data);
  //     // Handle the fetched data as needed
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //     // Optionally, display an error message to the user
  //   }
  // };

  // Optionally, fetch data on component mount
  // React.useEffect(() => {
  //   fetchUserData();
  // }, []);

  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>
      <p>Welcome, {auth.user && auth.user.name}!</p>
      <button onClick={logout} style={styles.button}>
        Log Out
      </button>
      {/* <button onClick={fetchUserData} style={styles.button}>
        Fetch User Data
      </button> */}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default Dashboard;
