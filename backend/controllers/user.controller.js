import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({});

// Retrieve the JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Controller function for user registration
export const userRegister = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Hash the user's password for secure storage
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object with the provided details
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();

        // Generate a JWT token for the newly registered user
        const token = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email,
            },
            JWT_SECRET,
            { expiresIn: '30d' } // Token expires in 30 days
        );

        // Return a success response with the token and user details
        res.status(201).json({
            success: true,
            message: "User is registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                wallet: newUser.wallet, // Assuming wallet is a property of the user model
            }
        });

    } catch (error) {
        // Log the error and return a server error response
        console.error('Signup error:', error.message);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Controller function for user login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate a JWT token for the authenticated user
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '30d' } // Token expires in 30 days
        );

        // Return a success response with the token and user details
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                wallet: user.wallet, // Assuming wallet is a property of the user model
            }
        });

    } catch (err) {
        // Log the error and return a server error response
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
