import mongoose from 'mongoose';

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    // User's name
    name: {
        type: String,
        require: true, // Name is required
    },
    // User's email
    email: {
        type: String,
        required: true, // Email is required
        unique: true, // Email must be unique
    },
    // User's password
    password: {
        type: String,
        required: true, // Password is required
    },
    // User's wallet balance
    wallet: {
        type: Number,
        default: 50000, // Default wallet balance is 50000
    },
    // List of bookings associated with the user
    bookings: [{
        type: mongoose.Schema.Types.ObjectId, // Reference to Booking model
        ref: 'Booking'
    }]
});

// Create the User model using the schema
const User = mongoose.model('User', userSchema);

// Export the User model
export default User;
