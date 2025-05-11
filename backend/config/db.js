/**
 * @fileoverview This module provides a utility function to establish a connection
 * to a MongoDB database using the Mongoose library. It also includes event listeners
 * to handle various connection states and ensures graceful termination of the database
 * connection when the application exits.
 * 
 * @module config/db
 * 
 * @requires mongoose
 * @requires dotenv
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import { generateSampleFlights } from '../utils/seedFlights.js';

dotenv.config({})

/**
 * Asynchronously connects to the MongoDB database using the Mongoose library.
 * 
 * This function retrieves the MongoDB connection URI from the environment variable `MONGO_URI`
 * and attempts to establish a connection. If the connection is successful, a success message
 * is logged to the console. If an error occurs during the connection attempt, the error is
 * logged to the console and re-thrown for further handling.
 * 
 * @async
 * @function connectDB
 * @throws {Error} Throws an error if the connection to MongoDB fails.
 * 
 * @example
 * // Ensure that the `MONGO_URI` environment variable is set before calling this function.
 * connectDB()
 *   .then(() => console.log("Database connection successful"))
 *   .catch(err => console.error("Database connection failed", err));
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Connection Error:", error);
        throw error;
    }
}
// Listen for mongoose connection events to handle connection states
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to the database');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from the database');
});

// Gracefully close the mongoose connection on process termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to application termination');
    process.exit(0);
});
export default connectDB;