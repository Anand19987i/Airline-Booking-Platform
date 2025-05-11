import React, { useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { Link, useNavigate } from 'react-router-dom';
import { setToken, setUser } from '../redux/authSlice';
import Spinner from '../components/Spinner';
import { useDispatch } from 'react-redux';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const Login = () => {
    // State to manage form data (email and password)
    const [formData, setFormData] = useState({ email: '', password: '' });

    // State to display error or success messages
    const [message, setMessage] = useState('');

    // State to manage loading spinner during API call
    const [loading, setLoading] = useState(false);

    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);

    // React Router's navigation hook
    const navigate = useNavigate();

    // Redux dispatch hook to update global state
    const dispatch = useDispatch();

    // Handle input field changes and update formData state
    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            setLoading(true); // Show loading spinner
            // Make API call to login endpoint
            const res = await axios.post(`${USER_API_END_POINT}/login`, formData, {
                withCredentials: true, // Include credentials for cookies
            });

            if (res.data.success) {
                // If login is successful, update Redux state with user and token
                dispatch(setUser(res.data.user));
                dispatch(setToken(res.data.token));
                navigate('/'); // Redirect to home page
                setLoading(false); // Hide loading spinner
            }
        } catch (err) {
            // Handle errors and display error message
            setLoading(false); // Hide loading spinner
            setMessage(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                {/* Login form header */}
                <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email input field */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    {/* Password input field with toggle visibility */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                        />
                        {/* Toggle password visibility icon */}
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
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200 cursor-pointer"
                    >
                        {loading ? <Spinner className="text-white" /> : 'Login'}
                    </button>
                </form>
                {/* Display error or success message */}
                {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
                {/* Link to signup page */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
