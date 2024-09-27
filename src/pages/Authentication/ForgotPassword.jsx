import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define initial values for the form
const initialValues = {
  email: '',
  newPassword: '',
  confirmNewPassword: ''
};

// Define validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Geçerli bir email adresi girin').required('Email boş bırakılamaz'),
  newPassword: Yup.string().required('Yeni şifre boş bırakılamaz'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Şifreler eşleşmiyor')
    .required('Şifreyi onaylayın')
});

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [message,setMessage] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/forgot-password', {
        email: values.email,
        newPassword: values.newPassword
      });
      console.log('Response Data:', response.data); // Yanıtı loglayın

      if (response.data.message === 'Password updated successfully') {
        setMessage('Şifreniz başarıyla güncellendi');
        setTimeout(() => {
          navigate('/login'); // 2 saniye sonra giriş sayfasına yönlendir
        }, 2000);
      } else if (response.data.message === 'User not found') {
        setError('Bu e-posta adresine sahip bir kullanıcı bulunamadı');
      } else {
        setError('Şifre güncellenirken bir hata oluştu');
      }
    } catch (error) {
      setError('Şifre güncellenirken bir hata oluştu. Lütfen tekrar deneyin');
      console.error('Password update error:', error);
    } finally {
      setSubmitting(false);
    }
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
              name="email"
              placeholder="Email"
              type="email"
              variant="outlined"
              fullWidth
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
          </div>
          <div>
            <Field
              as={TextField}
              name="newPassword"
              placeholder="Yeni Şifre"
              type="password"
              variant="outlined"
              fullWidth
              error={touched.newPassword && Boolean(errors.newPassword)}
              helperText={touched.newPassword && errors.newPassword}
            />
          </div>
          <div>
            <Field
              as={TextField}
              name="confirmNewPassword"
              placeholder="Yeni Şifreyi Onayla"
              type="password"
              variant="outlined"
              fullWidth
              error={touched.confirmNewPassword && Boolean(errors.confirmNewPassword)}
              helperText={touched.confirmNewPassword && errors.confirmNewPassword}
            />
          </div>
          {error && (
            <Typography color="error" style={{ marginTop: '16px' }}>
              {error}
            </Typography>
          )}
          {message && (
            <Typography color="primary" style={{ marginTop: '16px' }}>
              {message}
            </Typography>
)}
          <div>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '16px' }}
              disabled={isSubmitting}
            >
              Şifreyi Güncelle
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPassword;
