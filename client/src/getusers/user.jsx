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

  const [loginError, setLoginError] = useState("");

  // 🔒 NEW STATES
  const [lockTime, setLockTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

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

        if (response.data.accessToken) {
          const token = response.data.accessToken;

          localStorage.setItem('accessToken', token);

          setAuthToken(token);
          setToken(token);
        }

        setLoginError("");
        setLockTime(null);
        setTimeLeft(0);

        toast.success('Login successful')
        formik.resetForm();
        navigate('/home');

      } catch (error) {
        console.log(error);

        const data = error.response?.data;

        if (data) {
          if (data.remainingAttempts !== undefined) {
            const msg = `Incorrect password, ${data.remainingAttempts} attempts left`;
            setLoginError(msg);
            toast.error(msg, { position: "top-right" });
          } else {
            setLoginError(data.message);
            toast.error(data.message, { position: "top-right" });

            // 🔒 HANDLE LOCK
            if (data.message.includes("locked")) {
              const seconds = parseInt(data.message.match(/\d+/)?.[0] || "0");
              const unlockTime = Date.now() + seconds * 1000;

              setLockTime(unlockTime);
              setTimeLeft(seconds);
            }
          }
        } else {
          setLoginError("Error during login");
          toast.error('Error during login', { position: "top-right" });
        }
      }
    }
  });

  // ⏳ COUNTDOWN TIMER
  useEffect(() => {
    let timer;

    if (lockTime) {
      timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((lockTime - Date.now()) / 1000));

        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(timer);
          setLockTime(null);
          setLoginError("");
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [lockTime]);

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
            <input
              type="password"
              id='password'
              name='password'
              autoComplete='off'
              placeholder='Enter Password'
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={(e) => {
                formik.handleChange(e);
                setLoginError("");
              }}
            />

            {formik.touched.password && formik.errors.password ? (
              <span className="error">{formik.errors.password}</span>
            ) : null}

            {/* 🔴 ERROR / LOCK MESSAGE */}
            {loginError && (
              <span className="error">
                {timeLeft > 0
                  ? `Account locked. Try again in ${timeLeft} seconds`
                  : loginError}
              </span>
            )}
          </div>

          {/* 🔘 DISABLED BUTTON DURING LOCK */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={timeLeft > 0}
          >
            {timeLeft > 0 ? `Try again in ${timeLeft}s` : "sign in"}
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