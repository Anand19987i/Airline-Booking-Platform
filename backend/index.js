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

// Middleware setup

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors(corsOptions));

// Routes for controller
app.use('/api/v1/user', userRoute);
app.use('/api/v1/flight', flightRoute);
app.use('/api/v1/booking', bookingRoute);
app.use('/tickets', express.static(path.join(__dirname, 'tickets')));

const serverStart = async () => {
    try {
        // Attempt to establish a connection to the database.
        await connectDB();

        // Start the HTTP server and listen on the specified port.
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        // Log an error message if the database connection fails.
        console.error("Failed to connect DB", error);

        // Provide additional guidance to ensure the database is connected first.
        console.error('First Connect to DB');

        // Exit the process with a failure code.
        process.exit(1);
    }
};

serverStart();