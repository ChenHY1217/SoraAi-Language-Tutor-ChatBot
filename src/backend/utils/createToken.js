import jwt from 'jsonwebtoken';

const createToken = (res, userId) => {
    // // Add logging
    // console.log('Creating token with:', {
    //     secret: process.env.JWT_SECRET,
    //     expires: process.env.JWT_EXPIRES,
    //     cookieExpires: process.env.JWT_COOKIE_EXPIRES,
    //     nodeEnv: process.env.NODE_ENV
    // });

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000,
    });

    // Add cookie options logging
    const cookieOptions = {
        httpOnly: true,
        secure: true, // Required for cross-domain cookies
        sameSite: 'none', // Required for cross-domain cookies
        path: '/',
        maxAge: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000, // Convert days to milliseconds
        domain: '.onrender.com' // Allow sharing between subdomains on onrender.com
    };

    // console.log('Cookie options:', cookieOptions);

    return res.cookie('jwt', token, cookieOptions);
};

export default createToken;