import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDarkMode } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { BOOKING_API_END_POINT, TICKET_API_END_POINT } from '../../utils/constant';
import { SpinnerIcon } from '../../components/Icons';
import Spinner from '../../components/Spinner';

const MyBookings = () => {
    // Get user and token from Redux store
    const { user, token } = useSelector((store) => store.auth);
    // Get dark mode state from ThemeContext
    const { darkMode } = useDarkMode();
    const [bookings, setBookings] = useState([]); // State to store bookings
    const [loading, setLoading] = useState(true); // State to manage loading spinner
    const [error, setError] = useState(''); // State to store error messages

    useEffect(() => {
        // Function to fetch bookings from the API
        const fetchBookings = async () => {
            try {
                const res = await axios.get(`${BOOKING_API_END_POINT}/my-bookings/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBookings(res.data.bookings); // Update bookings state with API response
            } catch (err) {
                // Handle errors and set error message
                setError(err.response?.data?.message || 'Failed to fetch bookings.');
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };

        // Fetch bookings only if user and token are available
        if (user?.id && token) {
            fetchBookings();
        }
    }, [user, token]);

    return (
        <div className={`${darkMode ? 'bg-zinc-900 text-white' : 'bg-gray-100'} min-h-screen`}>
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

                {/* Show spinner while loading */}
                {loading && <Spinner className='' />}
                {/* Show error message if any */}
                {error && <p className="text-red-500">{error}</p>}
                {/* Show message if no bookings are found */}
                {!loading && bookings.length === 0 && <p>No bookings found.</p>}

                <div className="space-y-6">
                    {/* Render each booking */}
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}
                        >
                            {booking.flight ? (
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        {/* Display flight details */}
                                        <h4 className="text-lg font-semibold">{booking.flight.airline}</h4>
                                        <p className="text-sm">
                                            {booking.flight.from.city} ({booking.flight.from.iata}) →{' '}
                                            {booking.flight.to.city} ({booking.flight.to.iata})
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {booking.flight.from.airport} → {booking.flight.to.airport}
                                        </p>
                                    </div>

                                    <div className="text-sm">
                                        {/* Display passenger and booking details */}
                                        <p>
                                            <span className="font-medium">Passenger:</span> {booking.passengerName} (
                                            {booking.passengerAge} yrs)
                                        </p>
                                        <p>
                                            <span className="font-medium">Booked At:</span>{' '}
                                            {new Date(booking.bookedAt).toLocaleString()}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Price:</span> ₹{booking.price}
                                        </p>

                                        {/* Download Receipt Button */}
                                        <a
                                            href={`${TICKET_API_END_POINT}/ticket-${booking._id}.pdf`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded transition"
                                        >
                                            View Receipt
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                // Show message if flight details are not available
                                <p className="text-red-400">Flight details not available.</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyBookings;
