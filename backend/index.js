import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import connectDB from './config/db.js';
import userRoute from './routes/user.route.js';
import flightRoute from './routes/flight.route.js';
import bookingRoute from './routes/booking.route.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    // origin: "https://fbtrip-airline-booking.onrender.com", 
    origin: "http://localhost:5173",  
    credentials: true,
};

// Resolve __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS with the specified options
app.use(cors(corsOptions));

// Define routes for different API endpoints
app.use('/api/v1/user', userRoute); // User-related routes
app.use('/api/v1/flight', flightRoute); // Flight-related routes
app.use('/api/v1/booking', bookingRoute); // Booking-related routes

// Serve static files from the 'tickets' directory
app.use('/tickets', express.static(path.join(__dirname, 'tickets')));

// Create an HTTP server
const server = createServer(app);

// Function to start the server and connect to the database
const serverStart = async () => {
    try {
        await connectDB(); // Connect to the database
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`); // Log server start
        });
    } catch (error) {
        console.error("Failed to connect DB", error); 
        console.error('First Connect to DB');
        process.exit(1);
    }
};

// Start the server
serverStart();
