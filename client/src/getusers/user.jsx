import React, { useEffect, useState } from 'react'
import './user.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast';

const User = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users')
        console.log(response)
        setUsers(response.data)
      } catch (error) {
        console.log('Error fetching users:', error)
      }
    }

    fetchData()
  }, []);

  const deleteUser = async (userId) => {
    await axios.delete(`http://localhost:8000/api/delete/getById/${userId}`)
      .then((response) => {
        setUsers((prevUsers) => prevUsers.filter(user => user._id !== userId))
        toast.success("User deleted successfully", { position: "top-right" })

      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <div>
      <div className='userTable'>
        <Link to="/add" type="button" className="btn btn-primary">
          Add User <i className="fa-solid fa-user-plus"></i>
        </Link>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th scope='col'>S.No</th>
              <th scope='col'>Name</th>
              <th scope='col'>Email</th>
              <th scope='col'>Address</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              console.log(user)
              return (
                <tr>
                  <td>{index + 1} </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td className='actionButtons'>
                    <Link to={'/update/' + user._id} type="button" className="btn btn-info"><i className="fa-solid fa-pen-to-square"></i></Link>
                    <button
                      onClick={() => deleteUser(user._id)}
                      type="button" className="btn btn-danger"><i className="fa-solid fa-trash-can"></i></button>
                  </td>
                </tr>
              )
            })}

          </tbody>
        </table>
      </div>
    </div>
  )
}

export default User;
