import React, { useEffect } from 'react'
import './update.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'


const UpdateUser = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Name is required')
            .min(3, 'Name must be at least 3 characters'),
        email: Yup.string()
            .required('Email is required')
            .email('Invalid email format'),
        address: Yup.string()
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            address: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axios.put(`http://localhost:8000/api/update/getById/${id}`, values)
                toast.success("User updated successfully", { position: "top-right" })
                navigate("/")
            } catch (error) {
                console.log(error)
                toast.error('Error updating user', { position: "top-right" })
            }
        }
    });

    useEffect(() => {
        axios.get(`http://localhost:8000/api/getById/${id}`)
            .then(response => {
                formik.setValues(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [id]);

    const submitForm = (e) => {
        e.preventDefault();
        formik.handleSubmit(e);
    }
    return (
        <div className='addUser'>
            <Link to="/" className="btn"><i className="fa-solid fa-arrow-left"></i></Link>

            <h3>Update User</h3>
            <form className='addUserForm' onSubmit={submitForm}>
                <div className='inputGroup'>
                    <label htmlFor='name'>Name:</label>
                    <input type="text"
                        id='name'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        name='name'
                        autoComplete='off'
                        placeholder='Enter your name'
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <span className="error">{formik.errors.name}</span>
                    ) : null}
                </div>
                <div className='inputGroup'>
                    <label htmlFor='email'>Email:</label>
                    <input type="text"
                        id='email'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        name='email'
                        autoComplete='off'
                        placeholder='Enter your email'
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <span className="error">{formik.errors.email}</span>
                    ) : null}
                </div>

                <div className='inputGroup'>
                    <label htmlFor='address'>Address:</label>
                    <input type="text"
                        id='address'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                        name='address'
                        autoComplete='off'
                        placeholder='Enter your address'
                    />
                </div>
                <div className='inputGroup'>
                    <button type="submit" className="btn btn-primary">Update</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateUser
