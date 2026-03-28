import React, { useEffect, useState } from 'react'
import './home.css'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axiosInstance from '../utils/axiosConfig'

const Home = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/getallusers');
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching users:', error);
                toast.error('Error fetching users', { position: "top-right" });
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleUpdate = (userId) => {
        navigate(`/update/${userId}`);
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axiosInstance.delete(`/deleteuser/${userId}`);
                toast.success('User deleted successfully', { position: "top-right" });
                // Refresh the users list
                setUsers(users.filter(user => user._id !== userId));
            } catch (error) {
                console.log('Error deleting user:', error);
                toast.error('Error deleting user', { position: "top-right" });
            }
        }
    };

    return (
        <div className='home'>
            <div className='homeContainer'>
                <div className='homeButtons'>
                    <button onClick={() => navigate('/add')} className='btn btn-primary'>
                        Add New User
                    </button>

                </div>

                <div className='usersTableSection'>

                    {loading ? (
                        <p className='loadingText'>Loading users...</p>
                    ) : users.length === 0 ? (
                        <p className='noUsersText'>No users found</p>
                    ) : (
                        <table className='usersTable'>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Username</th>
                                    <th>Email ID</th>
                                    <th>Mobile Number</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.mobileNumber}</td>
                                        <td className='actionButtons'>
                                            <button
                                                onClick={() => handleUpdate(user._id)}
                                                className='btn-update'
                                            >
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className='btn-delete'
                                            >
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div>
                    <button onClick={() => {
                        localStorage.removeItem('loggedInUserId');
                        navigate('/');
                    }} className='btn btn-secondary'>
                        Sign Out
                    </button>
                </div>

            </div>

        </div>
    )
}

export default Home;
