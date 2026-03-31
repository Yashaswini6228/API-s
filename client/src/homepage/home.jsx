import React, { useEffect, useState } from 'react'
import './home.css'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axiosInstance from '../utils/axiosConfig'

const Home = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/getuserswithfilters', {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        query: searchQuery,
                        role: roleFilter,
                        sortBy: 'createdAt',
                        sortOrder: 'desc'
                    }
                });
                console.log('Response:', response.data);
                setUsers(response.data.users || []);
                setTotalUsers(response.data.total || 0);
                setTotalPages(response.data.totalPages || 0);
                setLoading(false);
            } catch (error) {
                console.error('Full error object:', error);
                console.error('Error response:', error.response);
                toast.error('Error fetching users', { position: "top-right" });
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, itemsPerPage, searchQuery, roleFilter]);

    const handleUpdate = (userId) => {
        navigate(`/update/${userId}`);
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axiosInstance.delete(`/deleteuser/${userId}`);
                toast.success('User deleted successfully', { position: "top-right" });
                // Refresh the users list
                setCurrentPage(1);
            } catch (error) {
                console.log('Error deleting user:', error);
                toast.error('Error deleting user', { position: "top-right" });
            }
        }
    };

    // Pagination and filtering handlers
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0); // Scroll to top
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page
    };

    const handleRoleFilterChange = (e) => {
        setRoleFilter(e.target.value);
        setCurrentPage(1); // Reset to first page
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setRoleFilter("");
        setCurrentPage(1);
    };

    return (
        <div className='home'>
            <div className='homeContainer'>
                <div className='homeButtons'>
                    <button onClick={() => navigate('/add')} className='btn btn-primary'>
                        Add New User
                    </button>
                </div>

                {/* Search and Filters Section */}
                <div className='searchAndFiltersSection'>
                    <div className='searchBox'>
                        <input
                            type='text'
                            placeholder='Search by name or email...'
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className='searchInput'
                        />
                    </div>

                    <div className='filterBox'>
                        <select
                            value={roleFilter}
                            onChange={handleRoleFilterChange}
                            className='roleFilterSelect'
                        >
                            <option value="">All Roles</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {(searchQuery || roleFilter) && (
                        <button
                            onClick={handleClearFilters}
                            className='btn btnClearFilters'
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                <div className='usersTableSection'>

                    {loading ? (
                        <p className='loadingText'>Loading users...</p>
                    ) : users.length === 0 ? (
                        <p className='noUsersText'>No users found</p>
                    ) : (
                        <>
                            <div className='paginationContainer'>
                                <div className='paginationLeft'>
                                    <div className='paginationRowsPerPage'>
                                        <label htmlFor='itemsPerPage'>Rows Per Page: </label>
                                        <select 
                                            id='itemsPerPage'
                                            value={itemsPerPage}
                                            onChange={handleItemsPerPageChange}
                                            className='rowsPerPageSelect'
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={15}>15</option>
                                            <option value={20}>20</option>
                                        </select>
                                    </div>
                                    <div className='paginationTotalItems'>
                                        Total items: {totalUsers}
                                    </div>
                                </div>

                                <div className='paginationRight'>
                                    <button 
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                        className='paginationArrowBtn'
                                        title='First page'
                                    >
                                        &laquo;
                                    </button>
                                    <button 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className='paginationArrowBtn'
                                        title='Previous page'
                                    >
                                        &lsaquo;
                                    </button>

                                    <div className='pageNumbersContainer'>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                            <button
                                                key={pageNumber}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`pageNumberBtn ${currentPage === pageNumber ? 'active' : ''}`}
                                            >
                                                {pageNumber}
                                            </button>
                                        ))}
                                    </div>

                                    <button 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className='paginationArrowBtn'
                                        title='Next page'
                                    >
                                        &rsaquo;
                                    </button>
                                    <button 
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className='paginationArrowBtn'
                                        title='Last page'
                                    >
                                        &raquo;
                                    </button>
                                </div>
                            </div>

                            <table className='usersTable'>
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Username</th>
                                        <th>Email ID</th>
                                        <th>Mobile Number</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user._id}>
                                            <td>{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.mobileNumber}</td>
                                            <td><span className={`roleBadge ${user.role}`}>{user.role}</span></td>
                                            <td className='actionButtons'>
                                                <button
                                                    onClick={() => handleUpdate(user._id)}
                                                    className='btn-update'
                                                    title='Edit user'
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className='btn-delete'
                                                    title='Delete user'
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
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
