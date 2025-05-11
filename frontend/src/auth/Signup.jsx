import React, { useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { Link, useNavigate } from 'react-router-dom';
import { setToken, setUser } from '../redux/authSlice';
import Spinner from '../components/Spinner';
import { useDispatch } from 'react-redux';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const Signup = () => {
    // State to manage form data
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
    // State to display error or success messages
    const [message, setMessage] = useState('');
    // State to manage loading spinner
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Handle input field changes
    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); // Show loading spinner
            const res = await axios.post(`${USER_API_END_POINT}/signup`, formData, {
                withCredentials: true,
            });
            if (res.data.success) {
                // Navigate to login page on successful signup
                navigate("/login");
                // Dispatch user and token to Redux store
                dispatch(setUser(res.data.user));
                dispatch(setToken(res.data.token));
                setLoading(false);
            }
        } catch (err) {
            setLoading(false); // Hide loading spinner
            // Display error message
            setMessage(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input field for full name */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    {/* Input field for email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    {/* Input field for password with toggle visibility */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                        />
                        {/* Toggle password visibility */}
                        <span
                            className="absolute right-3 top-3 cursor-pointer text-sm text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </span>
                    </div>
                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        {loading ? <Spinner className='text-white' /> : 'Signup'}
                    </button>
                </form>

                {/* Display error or success message */}
                {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}

                {/* Link to login page */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
