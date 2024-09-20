// src/pages/LoginPage.js
import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useCustomFetch from '../utils/customFetch';
import jwtDecode from 'jwt-decode';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const customFetch = useCustomFetch();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const data = await login(values);
      const { accessToken, refreshToken } = data;

      // Update auth context and localStorage
      setAuth({
        accessToken,
        refreshToken,
        user: jwtDecode(accessToken),
      });
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Navigate to dashboard or protected route
      navigate('/dashboard');
    } catch (error) {
      // Handle error (e.g., display error message)
      setErrors({ server: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Log In</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting, errors }) => (
          <Form style={styles.form}>
            {errors.server && <div style={styles.error}>{errors.server}</div>}
            <div style={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" style={styles.input} />
              <ErrorMessage name="email" component="div" style={styles.error} />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" style={styles.input} />
              <ErrorMessage name="password" component="div" style={styles.error} />
            </div>

            <button type="submit" disabled={isSubmitting} style={styles.button}>
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>

            <p style={styles.redirect}>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const styles = {
  container: {
    width: '400px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    marginTop: '5px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '5px',
  },
  redirect: {
    marginTop: '15px',
    textAlign: 'center',
  },
};

export default LoginPage;
