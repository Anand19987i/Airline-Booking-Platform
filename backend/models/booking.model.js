import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    passengerName: {
        type: String,
        required: true
    },
    passengerAge: {
        type: Number,
        required: true,
    },
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
    },
    price: {
        type: Number,
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Booking model using the schema
const Booking = mongoose.model('Booking', bookingSchema);

// Export the Booking model for use in other parts of the application
export default Booking;
