import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware to authenticate requests using a JSON Web Token (JWT).
 * Extracts the token from the 'Authorization' header, verifies it, and attaches
 * the decoded user information to the request object.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.header - Function to retrieve headers from the request.
 * @param {Object} res - The HTTP response object.
 * @param {Function} res.status - Function to set the HTTP status code.
 * @param {Function} res.json - Function to send a JSON response.
 * @param {Function} next - Callback to pass control to the next middleware.
 *
 * @throws {Error} 401 - If the token is missing or invalid.
 */
export const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'No token, access denied'
        })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } 
    catch (error) {
        res.status(401).json({ 
            message: 'Invalid token'
        })
    }
}