import React,{ useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define initial values for the form
const initialValues = {
  username: '',
  password: '',
  confirmPassword: '',
   email: ''
};

// Define validation schema using Yup
const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    email: Yup.string().email('Invalid email address').required('Email is required')
});

const Register = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigate();
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/register', values);
      console.log('Registration successful:', response.data);
      setMessage('Kayıt başarıyla oluşturuldu...Giriş yapabilirsiniz');
      setTimeout(() => {
        navigate('/login');
      }, 2000); 
  

    
    } catch (error) {
      if (error.response) {
        // Backend'den dönen hata
        console.error('Registration error:', error.response.data);
      } else if (error.request) {
        // İstek yapıldı ama yanıt alınamadı
        console.error('Registration error: No response received', error.request);
      } else {
        // Diğer hatalar
        console.error('Registration error:', error.message);
      }
    }
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      initialValues={initialValues}
    >
      {({ errors, touched }) => (
        <Form className="space-y-5">
          <div>
            <Field
              as={TextField}
              name="username"
              placeholder="Username"
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
              placeholder="Password"
              style={{ marginTop: '16px' }}
              type="password"
              variant="outlined"
              fullWidth
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
          </div>
          <div>
            <Field
              as={TextField}
              name="confirmPassword"
              placeholder="Confirm Password"
              style={{ marginTop: '16px' }}
              type="password"
              variant="outlined"
              fullWidth
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />
          </div>
          <div>
            <Field
              as={TextField}
              name="email"
              placeholder="Email"
              style={{ marginTop: '16px' }}
              type="email"
              variant="outlined"
              fullWidth
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
          </div>
          <div>
            <Button 
            sx={{padding: ".8rem 0rem"}}
            type="submit"
            variant="contained" 
            color="primary"
            style={{ marginTop: '16px' }}
            fullWidth>
              Register
            </Button>
          </div>
          <div className='flex gap-2 items-center justify-center pt-5 '>
            <p>Zaten bir hesabım var?</p>
            <Button onClick={()=>navigate("/login")}>Login</Button>
          </div>
          {message && <div>{message}</div>}
        </Form>
      )}
    </Formik>
  );
};

export default Register;