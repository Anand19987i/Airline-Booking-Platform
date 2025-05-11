import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDarkMode } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { BOOKING_API_END_POINT } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { setUser, updateWallet } from '../../redux/authSlice';

const BookFlightDetails = () => {
  const { user, token } = useSelector(store => store.auth); // Get user and token from Redux store
  const { singleFlight } = useSelector(store => store.flight); // Get selected flight details from Redux store
  const { darkMode } = useDarkMode(); // Get dark mode state from context
  const navigate = useNavigate(); // React Router hook for navigation
  const dispatch = useDispatch(); // Redux dispatch function

  const [formData, setFormData] = useState({
    passengerName: '',
    passengerAge: '',
  }); // State for passenger form data

  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(''); // State for error messages
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false); // State for insufficient balance popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if user has sufficient wallet balance
    if (user.wallet < singleFlight.currentPrice) {
      setShowInsufficientBalance(true);
      setLoading(false);
      return;
    }

    try {
      // Make API call to book the flight
      const res = await axios.post(`${BOOKING_API_END_POINT}/book`, {
        user: user.id,
        passengerName: formData.passengerName,
        passengerAge: formData.passengerAge,
        flight: singleFlight._id,
        price: singleFlight.currentPrice,
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Pass token in headers for authentication
        }
      });

      setShowSuccessPopup(true); // Show success popup
      dispatch(updateWallet(user.wallet - res.data.booking.price)); // Update wallet balance in Redux store
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate(`/users/${user?.name}/bookings/${user?.id}`); // Redirect to user's bookings page
      }, 2000);

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to book flight'); // Handle API errors
    } finally {
      setLoading(false);
    }
  };

  if (!singleFlight) return <div className="text-center mt-10 text-lg">No flight selected.</div>; // Show message if no flight is selected

  return (
    <div className={`${darkMode ? 'bg-zinc-900 text-white' : 'bg-gray-100'} min-h-screen`}>
      <Navbar />
      <div className={`${darkMode ? 'bg-zinc-900 text-white' : 'bg-gray-100 text-gray-800'} max-w-3xl mx-auto py-10 px-6 `}>
        <h2 className="text-2xl font-bold mb-6">Review & Book</h2>

        {/* Flight Summary */}
        <div className={`p-6 rounded-xl shadow-md mb-8 space-y-2 ${darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-gray-800'}`}>
          <h3 className="text-xl font-semibold">{singleFlight.airline} - {singleFlight.flightNumber}</h3>
          <p className="text-sm">{singleFlight.from.city} ({singleFlight.from.iata}) → {singleFlight.to.city} ({singleFlight.to.iata})</p>
          <p className="text-xs text-gray-400">{singleFlight.from.airport} → {singleFlight.to.airport}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm font-medium">Departure</p>
              <p>{new Date(singleFlight.departureTime).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Arrival</p>
              <p>{new Date(singleFlight.arrivalTime).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Duration</p>
              <p>{singleFlight.duration}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Seats Available</p>
              <p>{singleFlight.availableSeats} / {singleFlight.totalSeats}</p>
            </div>
          </div>

          <p className="text-lg font-bold mt-4">Price: ₹{singleFlight.currentPrice}</p>
        </div>

        {/* Passenger Form */}
        <form onSubmit={handleSubmit} className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
          <h4 className="text-lg font-semibold mb-4">Passenger Details</h4>

          <div className="mb-4">
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              required
              className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-white border-gray-300'}`}
              value={formData.passengerName}
              onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Age</label>
            <input
              type="number"
              required
              className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-white border-gray-300'}`}
              value={formData.passengerAge}
              onChange={(e) => setFormData({ ...formData, passengerAge: e.target.value })}
              min={1}
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>} {/* Display error message if any */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 mt-4 rounded-lg font-medium transition-all 
              ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
              ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Booking...' : 'Confirm Booking'} {/* Show loading state */}
          </button>
        </form>

        {/* Insufficient Balance Popup */}
        {showInsufficientBalance && (
          <div className="fixed inset-0 bg-black opacity-100 flex justify-center items-center z-50">
            <div className={`p-6 rounded-lg max-w-sm w-full ${darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-gray-800'}`}>
              <h3 className="text-lg font-semibold mb-2">Insufficient Balance</h3>
              <p className="mb-4">Your wallet balance is too low to book this flight. Please top up your wallet.</p>
              <div className="flex justify-end">
                <button
                  className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  onClick={() => setShowInsufficientBalance(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black opacity-100 flex justify-center items-center z-50">
            <div className={`p-6 rounded-lg max-w-sm w-full ${darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-gray-800'}`}>
              <h3 className="text-lg font-semibold mb-2">Booking Confirmed</h3>
              <p className="mb-4">Your flight has been successfully booked! Redirecting to your bookings...</p>
              <div className="flex justify-end">
                <button
                  className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  onClick={() => {
                    setShowSuccessPopup(false);
                    navigate(`/users/${user?.name}/bookings/${user?.id}`);
                  }}
                >
                  View Bookings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookFlightDetails;
