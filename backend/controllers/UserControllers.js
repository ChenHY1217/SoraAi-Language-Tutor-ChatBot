import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/createToken.js";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Check if all fields are filled
    if (!username || !email || !password) {
        throw new Error('Please fill in all fields');
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new Error('User already exists');
    }

    // Hash the password (Add salt for more security)
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });

    try{
        // Save the new user to the database
        await newUser.save();
        createToken(res, newUser._id);
        
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            message: 'User created successfully'
        });

    } catch (error) {
        throw new Error('User not created. Invalid user data');
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for existing user
    const user = await User.findOne({ email });

    // Check if the user exists and the password is correct
    if (user && (await bcryptjs.compare(password, user.password))) {
        createToken(res, user._id);
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            message: 'User logged in successfully'
        });
    } else {
        throw new Error('Invalid email or password');
    }
});

// @desc    Log current user out
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    
    // Clear the cookie
    res.cookie('jwt', '', {
        expires: new Date(0),
        httpOnly: true
    });

    res.status(200).json({ message: 'User logged out successfully' });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getCurrentUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }

});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateCurrentUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            message: 'User updated successfully'
        });

    } else {
        res.status(404);
        throw new Error('User not found');
    }

});

export { registerUser, loginUser, logoutUser, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile };