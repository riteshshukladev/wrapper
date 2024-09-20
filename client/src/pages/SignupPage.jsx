// src/pages/SignupPage.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { signup } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const { confirmPassword, ...userData } = values;
      await signup(userData);
      // Handle success (e.g., navigate to login)
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
      <h2>Sign Up</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting, errors }) => (
          <Form style={styles.form}>
            {errors.server && <div style={styles.error}>{errors.server}</div>}
            <div style={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <Field type="text" name="name" style={styles.input} />
              <ErrorMessage name="name" component="div" style={styles.error} />
            </div>

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

            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field type="password" name="confirmPassword" style={styles.input} />
              <ErrorMessage name="confirmPassword" component="div" style={styles.error} />
            </div>

            <button type="submit" disabled={isSubmitting} style={styles.button}>
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </button>

            <p style={styles.redirect}>
              Already have an account? <Link to="/login">Log In</Link>
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

export default SignupPage;
