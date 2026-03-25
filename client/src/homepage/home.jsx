import React from 'react'
import './home.css'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className='home'>
      <div className='homeContainer'>
        <h1>Welcome to Dashboard</h1>
        <p>You have successfully signed in!</p>
        <div className='homeButtons'>
          <button onClick={() => navigate('/add')} className='btn btn-primary'>
            Add New User
          </button>
          <button onClick={() => navigate('/')} className='btn btn-secondary'>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home;
