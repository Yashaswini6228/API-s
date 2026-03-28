import React from 'react'
import "./registeruser.css"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'


const RegisterUser = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Username is required!')
            .min(3, 'Username must be at least 3 characters'),
        email: Yup.string()
            .required('Email is required!')
            .email('Invalid email format!'),
        password: Yup.string()
            .required('Password is required!')
            .min(6, 'Password must be at least 6 characters'),
        mobileNumber: Yup.string()
            .required('Mobile Number is required!')
            .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
        yearOfJoining: Yup.string()
            .required('Year of Joining is required!'),
        // yearOfPassout: Yup.string(),
        // tenthPercentage: Yup.number(),
        // resume: Yup.mixed()
        //     .required('Resume is required!')
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            mobileNumber: "",
            yearOfJoining: "",
            yearOfPassout: "",
            tenthPercentage: "",
            resume: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('email', values.email);
                formData.append('password', values.password);
                formData.append('mobileNumber', values.mobileNumber);
                formData.append('yearOfJoining', values.yearOfJoining);

                if (values.yearOfPassout) {
                    formData.append('yearOfPassout', values.yearOfPassout);
                }
                if (values.tenthPercentage) {
                    formData.append('tenthPercentage', values.tenthPercentage);
                }
                if (values.resume) {
                    formData.append('resume', values.resume);
                }

                const response = await axios.post('http://localhost:8000/api/register', formData)
                toast.success(response.data.message, { position: "top-right" })
                navigate("/");
            } catch (error) {
                console.log('Error response:', error.response?.data);
                console.log('Error status:', error.response?.status);
                toast.error(error.response?.data?.errorMessage || error.response?.data?.Message || 'Error adding user', { position: "top-right" })
            }
        }
    });

    const handleFileChange = (event) => {
        const file = event.currentTarget.files[0];
        formik.setFieldValue('resume', file);
        formik.setFieldTouched('resume', true);
    }

    const submitForm = (e) => {
        e.preventDefault();
        formik.handleSubmit(e);
    }

    return (
        <div className='addUser'>
            <Link to="/" className="btns"><i className="fa-solid fa-arrow-left" ></i></Link>
            <h3>User Registration</h3>
            <form className='addUserForm' onSubmit={submitForm}>
                <div className='formSection'>
                    <h4>User Details</h4>
                    <div className='formGrid'>
                        <div className='inputGroup'>
                            <label htmlFor='Username'>Username*:</label>
                            <input type="text"
                                id='Username'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                                name='name'
                                autoComplete='off'
                                placeholder='Enter Username'
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <span className="error">{formik.errors.name}</span>
                            ) : null}
                        </div>

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

                        <div className='inputGroup'>
                            <label htmlFor='mobileNumber'>Mobile Number*:</label>
                            <input type="text"
                                id='mobileNumber'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.mobileNumber}
                                name='mobileNumber'
                                autoComplete='off'
                                placeholder='Enter Mobile Number'
                            />
                            {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
                                <span className="error">{formik.errors.mobileNumber}</span>
                            ) : null}
                        </div>
                    </div>
                </div>


                <div className='formSection'>

                    <h4>Academic Details</h4>
                    <div className='formGrid'>
                        <div className='inputGroup'>
                            <label htmlFor='yearOfJoining'>Year of Joining:</label>
                            <select
                                id='yearOfJoining'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.yearOfJoining}
                                name='yearOfJoining'
                            >
                                <option value="">Select...</option>
                                {Array.from({ length: 10 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return <option key={year} value={year}>{year}</option>
                                })}
                            </select>
                            {formik.touched.yearOfJoining && formik.errors.yearOfJoining ? (
                                <span className="error">{formik.errors.yearOfJoining}</span>
                            ) : null}
                        </div>

                        <div className='inputGroup'>
                            <label htmlFor='yearOfPassout'>Year of Passout:</label>
                            <select
                                id='yearOfPassout'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.yearOfPassout}
                                name='yearOfPassout'
                            >
                                <option value="">Select...</option>
                                {Array.from({ length: 10 }, (_, i) => {
                                    const year = new Date().getFullYear() + i;
                                    return <option key={year} value={year}>{year}</option>
                                })}
                            </select>
                        </div>

                        <div className='inputGroup'>
                            <label htmlFor='resume'>Resume*:</label>
                            <input
                                type="file"
                                id='resume'
                                onChange={handleFileChange}
                                onBlur={formik.handleBlur}
                                name='resume'
                                accept=".pdf,.doc,.docx"
                            />
                            {formik.values.resume && <span className="file-name">{formik.values.resume.name}</span>}
                            {formik.touched.resume && formik.errors.resume ? (
                                <span className="error">{formik.errors.resume}</span>
                            ) : null}
                        </div>

                        <div className='inputGroup'>
                            <label htmlFor='tenthPercentage'>Tenth Percentage:</label>
                            <input
                                type="number"
                                id='tenthPercentage'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.tenthPercentage}
                                name='tenthPercentage'
                                placeholder='Enter Tenth Percentage'
                                min="0"
                                max="100"
                                step="0.01"
                            />
                        </div>
                    </div>
                </div>

                <div className='formActions'>
                    <button type="submit" className="btn btn-primary">Register User</button>
                </div>
            </form>
        </div>
    )
}

export default RegisterUser
