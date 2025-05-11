import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  airport: { type: String, required: true },
  iata: { type: String, required: true }
}, { _id: false });

const flightSchema = new mongoose.Schema({
  airline: {
    type: String,
    enum: ['IndiGo', 'SpiceJet', 'Air India', 'Vistara'],
    required: true
  },

  flightNumber: {
    type: String,
    required: true,
    unique: true // optional but useful
  },

  from: {
    type: locationSchema,
    required: true
  },

  to: {
    type: locationSchema,
    required: true
  },

  departureTime: {
    type: Date,
    required: true
  },

  arrivalTime: {
    type: Date,
    required: true
  },

  duration: {
    type: String,
    required: true
  },

  totalSeats: {
    type: Number,
    required: true,
    default: 180
  },

  availableSeats: {
    type: Number,
    required: true,
    default: 180
  },

  basePrice: {
    type: Number,
    min: 2000,
    max: 3000,
    required: true
  },

  currentPrice: {
    type: Number,
    required: true
  },

  recentBookings: [
    {
      time: {
        type: Date,
        default: Date.now
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }

    }
  ],

  priceResetAt: {
    type: Date,
    default: null
  }
});


const Flight = mongoose.model('Flight', flightSchema);
export default Flight;
