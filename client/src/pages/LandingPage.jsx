// src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to AuthApp</h1>
      <div style={styles.buttonContainer}>
        <Link to="/signup">
          <button style={styles.button}>Sign Up</button>
        </Link>
        <Link to="/login">
          <button style={styles.button}>Log In</button>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
  },
  buttonContainer: {
    marginTop: '50px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default LandingPage;
