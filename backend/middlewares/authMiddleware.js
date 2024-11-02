import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from './asyncHandler.js';

// Check if the user is authenticated or not
const authenticate = asyncHandler(async (req, res, next) => {

    let token;

    // Read JWT from the 'jwt' cookie
    token = req.cookies ? req.cookies.jwt : null;

    if (token){
        try{

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
            req.user = await User.findById(decoded.userId).select('-password');
            next();

        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else{
        res.status(401);
        throw new Error('Not authorized, no token found');
    }

});

// Check if the user is an admin or not
const authorizeAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next();
    } else{
        res.status(401).send('Not authorized as an admin');
    }
};

export { authenticate, authorizeAdmin };