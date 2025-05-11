import Flight from '../models/flight.model.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({});

// Controller function to search for flights
export const searchFlights = async (req, res) => {
    try {
        const { from, to } = req.query;
        const now = new Date();

        const matchCondition = {};
        if (from) matchCondition['from.iata'] = from;
        if (to) matchCondition['to.iata'] = to;

        const flights = await Flight.find(matchCondition)
            .sort({ departureTime: 1 })
            .limit(10);

        // Reset prices for flights where priceResetAt has expired
        await Promise.all(flights.map(async (flight) => {
            if (flight.priceResetAt && flight.priceResetAt < now) {
                await Flight.findByIdAndUpdate(flight._id, {
                    $set: { currentPrice: flight.basePrice },
                    $unset: { priceResetAt: 1 }
                });
            }
        }));

        // Fetch updated flight data
        const updatedFlights = await Flight.find(matchCondition)
            .sort({ departureTime: 1 })
            .limit(10);

        res.json({
            success: true,
            flights: updatedFlights.map(f => ({
                ...f.toObject(),
                currentPrice: f.currentPrice || f.basePrice
            }))
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