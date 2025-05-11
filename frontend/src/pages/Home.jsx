import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import FlightsPage from './Flights/FlightsPage'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  // Extracting user and token from the auth slice of the Redux store
  const { user, token } = useSelector((store) => store.auth)
  // Extracting flight data from the flight slice of the Redux store
  const { flight } = useSelector(store => store.flight);
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page if user is not authenticated
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div>
      {/* Navbar component */}
      <Navbar />
      {/* FlightsPage component */}
      <FlightsPage />
    </div>
  )
}

export default Home