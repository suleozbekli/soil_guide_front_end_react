import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin

// Define initial values for the form
const initialValues = {
  username: '',
  password: ''
};

// Define validation schema using Yup
const validationSchema = Yup.object({
  username: Yup.string().required('Kullanıcı adı boş bırakılamaz'),
  password: Yup.string().required('Şifre boş bırakılamaz')
});

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', values);
      console.log('Response:', response);

      if (response.data.message === 'Login successful') {
        navigate('/home', {
          state: {
            userId: response.data.userId,
            username: response.data.username,
          }
        });
        console.log("Username from location.state:", response.data.username);
        console.log("UserID from location.state:", response.data.userId);
      } else {
        setError('Login failed');
      }
    } catch (error) {
      setError('Lütfen şifrenizi veya kullanıcı adınızı kontrol ediniz!');
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Google Login handler
  const handleGoogleSuccess = (credentialResponse) => {
    axios.post('http://localhost:8080/api/users/api/google-login', { tokenId: credentialResponse.credential })
      .then((response) => {
        console.log('Giriş başarılı:', response.data);
      const { message, userId, username } = response.data; // Yanıttan gerekli bilgileri al

      // Kullanıcı bilgilerini konsola yazdır
      console.log('Mesaj:', message);
      console.log('Kullanıcı ID:', userId);
      console.log('Kullanıcı Adı:', username);
      console.log('Token:', credentialResponse.credential);
        console.log()
        navigate('/home', {
          state: {
            userId: response.data.userId,
            username: response.data.username,
          }
        });
      })
      .catch((error) => {
        console.error('Google Login failed', error);
      });
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failed', error);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <div>
            <Field
              as={TextField}
              name="username"
              placeholder="Kullanıcı Adı"
              type="text"
              variant="outlined"
              fullWidth
              error={touched.username && Boolean(errors.username)}
              helperText={touched.username && errors.username}
            />
          </div>
          <div>
            <Field
              as={TextField}
              name="password"
              placeholder="Şifre"
              type="password"
              variant="outlined"
              fullWidth
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
          </div>
          {error && (
            <Typography color="error" style={{ marginTop: '16px' }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
            disabled={isSubmitting}
          >
            Giriş Yap
          </Button>
          <div className='flex gap-2 items-center justify-center pt-5'>
            <p>Hesabınız yok mu</p>
            <Button onClick={() => navigate("/register")}>Kayıt ol</Button>
          </div>
          <div className='flex flex-col items-center pt-3'>
          <Button onClick={() => navigate("/forgot-password")}>Şifremi Unuttum</Button>
          <GoogleLogin
           onSuccess={handleGoogleSuccess}
           onError={handleGoogleFailure}
           logo_alignment="under"
         />
            
         </div>

        </Form>
      )}
    </Formik>
  );
};

export default Login;

