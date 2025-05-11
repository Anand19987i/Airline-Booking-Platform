import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { bookFlight, getUserBookings } from "../controllers/booking.controller.js";


const router = Router();

router.post('/book', auth, bookFlight);
router.get('/my-bookings/:userId', auth, getUserBookings);

export default router;