import jwt from 'jsonwebtoken';

const createToken = (res, userId) => {
    // Create a JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000,
    });

    // Send the JWT token as an HTTP-Only cookie
    return res.cookie('jwt', token, {
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
};

export default createToken;