import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { airportAPI, searchFlights } from "../controllers/flight.controller.js";



const router = Router();

router.get('/search', auth, searchFlights);
router.get('/amadeus/token', auth, airportAPI);

export default router;