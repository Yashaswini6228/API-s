import React, { useEffect, useState } from 'react'
import './user.css'
import axiosInstance from '../utils/axiosConfig'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { setAuthToken } from '../utils/axiosConfig';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const validationSchema = Yup.object({
  email: Yup.string()
    .required('Email is required!')
    .email('Invalid email format!'),
  password: Yup.string()
    .required('Password is required!')
    .min(6, 'Password must be at least 6 characters'),
});


const User = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([])
  const { setToken } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.post('/login', {
          email: values.email,
          password: values.password
        });
        console.log(' ', response);
        if (response.data.accessToken) {
          const token = response.data.accessToken;

          localStorage.setItem('accessToken', token);

          setAuthToken(token);   // ✅ update axios 
          setToken(token);       // ✅ update context
        }

        toast.success('Login successful')
        formik.resetForm();
        navigate('/home');

      } catch (error) {
        console.log(error)
        if (error.response && error.response.status === 401) {
          toast.error('Invalid credentials', { position: "top-right" })
        } else {
          toast.error('Error during login', { position: "top-right" })
        }
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/getallusers')
        setUsers(response.data)
      } catch (error) {
        console.log('Error fetching users:', error)
      }
    }

    fetchData()
  }, []);



  return (
    <div>
      <div className='userTable'>
        <h1>Learning made easy. Let's go</h1>
        <h5>Sign in to your Account</h5>
        <form onSubmit={formik.handleSubmit}>
          <div className='inputGroup'>
            <label htmlFor='email'>Email*:</label>
            <input type="email"
              id='email'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              name='email'
              autoComplete='off'
              placeholder='Enter Email'
            />
            {formik.touched.email && formik.errors.email ? (
              <span className="error">{formik.errors.email}</span>
            ) : null}
          </div>
          <div className='inputGroup'>
            <label htmlFor='password'>Password*:</label>
            <input type="password"
              id='password'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              name='password'
              autoComplete='off'
              placeholder='Enter Password'
            />
            {formik.touched.password && formik.errors.password ? (
              <span className="error">{formik.errors.password}</span>
            ) : null}
          </div>
          <button type="submit" className="btn btn-primary">
            sign in
          </button>
        </form>
        <p>Don't have an account?
          <button onClick={() => navigate('/register')} className="btn btn-primary">
            sign up
          </button>
        </p>

      </div>
    </div>
  )
}

export default User;
