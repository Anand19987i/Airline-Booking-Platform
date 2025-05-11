import Flight from '../models/flight.model.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({});

// Controller function to search for flights
export const searchFlights = async (req, res) => {
    try {
        const { from, to } = req.query;

        const matchCondition = {};
        if (from) matchCondition['from.iata'] = from;
        if (to) matchCondition['to.iata'] = to;

        const flights = await Flight.find(matchCondition)
            .sort({ departureTime: 1 })
            .limit(10);

        const now = new Date();

        const updatedFlights = flights.map((flight) => {
            // Filter recent bookings within 5 minutes for *this* flight
            const recentBookings = (flight.recentBookings || []).filter((b) =>
                now - new Date(b.time) <= 5 * 60 * 1000
            );

            let price = flight.basePrice;

            // If this specific flight has 3+ bookings in last 5 min
            if (recentBookings.length >= 2) {
                if (!flight.priceResetAt) {
                    flight.priceResetAt = now;
                }
                price = flight.basePrice * 1.1;
            } else if (flight.priceResetAt) {
                const resetTime = new Date(flight.priceResetAt);
                if (now - resetTime > 10 * 60 * 1000) {
                    price = flight.basePrice; // reset after 10 minutes
                    flight.priceResetAt = null;
                } else {
                    price = flight.basePrice * 1.1; // still within raised price window
                }
            }

            return {
                ...flight.toObject(),
                currentPrice: Math.round(price),
            };
        });

        res.json({
            success: true,
            updatedFlights,
        });
    } catch (error) {
        console.error('Error searching flights:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch flights',
        });
    }
};


let tokenCache = null;
let tokenExpiry = 0;
export const airportAPI = async (req, res) => {
    const now = Date.now();
    if (!tokenCache || now >= tokenExpiry) {
        try {
            const response = await axios.post(
                'https://test.api.amadeus.com/v1/security/oauth2/token',
                new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: process.env.AMADEUS_API_KEY,
                    client_secret: process.env.AMADEUS_API_SECRET
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            tokenCache = response.data.access_token;
            tokenExpiry = now + (response.data.expires_in - 300) * 1000;
        } catch (error) {
            res.json({
                success: false,
                message: "Error in Airport Token",
            })
        }
    }
    return res.json({ access_token: tokenCache });
}