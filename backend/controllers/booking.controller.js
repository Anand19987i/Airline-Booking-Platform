import Booking from '../models/booking.model.js';
import Flight from '../models/flight.model.js';
import User from '../models/user.model.js';
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Controller to handle flight booking
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const bookFlight = async (req, res) => {
    const { user, flight, passengerName, passengerAge } = req.body;

    try {
        // Fetch data with proper error handling
        const [userData, flightData] = await Promise.all([
            User.findById(user).lean(),
            Flight.findById(flight).lean()
        ]);

        if (!userData || !flightData) {
            return res.status(404).json({
                success: false,
                message: 'User or Flight not found'
            });
        }

        // Check and reset flight price if needed
        const now = new Date();
        if (flightData.priceResetAt && new Date(flightData.priceResetAt) < now) {
            await Flight.findByIdAndUpdate(flight, {
                $set: { currentPrice: flightData.basePrice },
                $unset: { priceResetAt: 1 }
            });
            flightData.currentPrice = flightData.basePrice;
            delete flightData.priceResetAt;
        }

        // Calculate surge price
        const recentBookingsIn5Min = flightData.recentBookings.filter(b =>
            now - new Date(b.time) <= 5 * 60 * 1000
        );

        const uniqueUsers = new Set(recentBookingsIn5Min.map(b => b.user.toString()));
        const currentUserId = userData._id.toString();
        let uniqueUserCount = uniqueUsers.size;

        if (!uniqueUsers.has(currentUserId)) {
            uniqueUserCount += 1;
        }

        let finalPrice = flightData.basePrice;
        let surgeApplied = false;

        if (uniqueUserCount >= 3) {
            finalPrice = flightData.basePrice * 1.1;
            surgeApplied = true;
        }

        // Wallet check
        if (userData.wallet < finalPrice) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient wallet balance',
                required: finalPrice,
                current: userData.wallet
            });
        }

        // Create booking first to get ID
        const booking = await Booking.create({
            user: userData._id,
            flight: flightData._id,
            passengerName,
            passengerAge,
            price: finalPrice,
            surgeApplied,
            updatedWallet: userData.wallet - finalPrice
        });

        // Update flight with recent booking and price if surged
        const updateOperations = {
            $push: { recentBookings: { time: now, user: userData._id } }
        };

        if (surgeApplied) {
            updateOperations.$set = {
                currentPrice: finalPrice,
                priceResetAt: new Date(now.getTime() + 10 * 60 * 1000)
            };
        }

        await Promise.all([
            User.findByIdAndUpdate(user, {
                $inc: { wallet: -finalPrice },
                $push: { bookings: booking._id }
            }),
            Flight.findByIdAndUpdate(flight, updateOperations)
        ]);
        // Generate professional PDF receipt
        // Generate PDF ticket
        // I can use cloudinary for storing pdf file but this project is for testing purpose that why i store pdf in the server
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            layout: 'portrait',
            info: {
                Title: `Flight Ticket - ${booking._id}`,
                Author: 'FBTRIP Airlines',
                Creator: 'FBTRIP Booking System',
            },
        });

        const ticketPath = path.join(__dirname, `../tickets/ticket-${booking._id}.pdf`);
        doc.pipe(fs.createWriteStream(ticketPath));

        // ---------------------- HEADER ----------------------
        doc.font('Helvetica-Bold').fillColor('#1e3a8a');
        doc
            .fontSize(20)
            .text('FBTRIP AIRLINES', 50, 50)
            .fontSize(10)
            .fillColor('#666')
            .text('291 Airport Road, SkyCity', 50, 75)
            .text('+91 999 898 9091 | www.fbtrip-airline-booking.onrender.com', 50, 90)
            .moveTo(50, 105)
            .lineTo(545, 105)
            .lineWidth(1.5)
            .stroke();

        let y = 120;

        // ---------------------- TICKET HEADER ----------------------
        doc
            .fontSize(16)
            .fillColor('#1e3a8a')
            .text('ELECTRONIC TICKET RECEIPT', 50, y)
            .fontSize(10)
            .fillColor('#666')
            .text(`Issued: ${new Date().toLocaleDateString()}`, 400, y, { align: 'right' });

        y += 30;

        // ---------------------- PASSENGER & BOOKING INFO ----------------------
        doc.fontSize(12).fillColor('#1e3a8a').text('PASSENGER DETAILS', 50, y);
        doc.fontSize(12).fillColor('#1e3a8a').text('BOOKING INFORMATION', 300, y);

        y += 18;
        doc.fontSize(10).fillColor('#333')
            .text(`Name:`, 50, y)
            .text(`${passengerName}`, 120, y)
            .text(`Booking ID:`, 300, y)
            .text(`${booking._id}`, 400, y);

        y += 15;
        doc.text(`Age:`, 50, y)
            .text(`${passengerAge}`, 120, y)

        y += 15;
        doc.text(`Booked by:`, 50, y)
            .text(`${userData.name}`, 120, y)
            .text(`Status:`, 300, y)
            .text(`CONFIRMED`, 400, y);

        y += 30;

        // ---------------------- FLIGHT DETAILS ----------------------
        doc.fontSize(12).fillColor('#1e3a8a').text('FLIGHT DETAILS', 50, y);
        y += 20;

        // Table Header
        doc
            .fillColor('#fff')
            .rect(50, y, 500, 20)
            .fill('#1e3a8a')
            .fontSize(10)
            .text('Airline', 60, y + 5)
            .text('Flight No.', 150, y + 5)
            .text('Departure', 250, y + 5)
            .text('Arrival', 370, y + 5)
            .text('Duration', 480, y + 5);

        y += 25;

        // Table Row
        doc
            .fillColor('#333')
            .text(flightData.airline, 60, y)
            .text(flightData.flightNumber, 150, y)
            .text(new Date(flightData.departureTime).toLocaleString(), 250, y)
            .text(new Date(flightData.arrivalTime).toLocaleString(), 370, y)
            .text(`${flightData.duration} mins`, 480, y);

        y += 40;

        // ---------------------- FARE BREAKDOWN ----------------------
        doc.fontSize(12).fillColor('#1e3a8a').text('FARE BREAKDOWN', 50, y);
        y += 18;

        doc.fontSize(10).fillColor('#333')
            .text('Description', 50, y)
            .text('Amount (INR)', 450, y, { align: 'right' });

        y += 10;
        doc.moveTo(50, y).lineTo(550, y).strokeColor('#ccc').lineWidth(0.5).stroke();

        y += 10;
        doc.text('Base Fare', 50, y).text(flightData.basePrice.toFixed(2), 450, y, { align: 'right' });

        y += 15;
        doc.text('Taxes & Fees', 50, y).text((booking.price - flightData.basePrice).toFixed(2), 450, y, { align: 'right' });

        y += 15;
        doc.moveTo(50, y).lineTo(550, y).stroke();

        y += 10;
        doc.font('Helvetica-Bold')
            .text('Total', 50, y)
            .text(booking.price.toFixed(2), 450, y, { align: 'right' })
            .font('Helvetica');

        y += 40;

        // ---------------------- FOOTER ----------------------
        doc.fontSize(8).fillColor('#666')
            .text('Terms & Conditions:', 50, y)
            .text('• Ticket non-transferable • Changes may incur fees • Valid government ID required • Baggage fees may apply', 50, y + 12, { width: 500 })
            .text('Security: Keep this document confidential. Report any discrepancies immediately.', 50, y + 30, { width: 500 });

        doc.end();


        // Response
        res.status(201).json({
            success: true,
            message: 'Booking confirmed',
            bookingId: booking._id,
            ticketUrl: `/tickets/ticket-${booking._id}.pdf`,
            newBalance: userData.wallet - finalPrice
        });

    } catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({
            success: false,
            message: 'Booking processing failed',
            error: error.message
        });
    }
};

// Controller to get all bookings of a user
export const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const bookings = await Booking.find({ user: userId })
            .populate({
                path: 'flight',
                select: 'airline from to departureTime currentPrice duration', // only needed fields
            })
            .sort({ bookedAt: -1 });

        res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
