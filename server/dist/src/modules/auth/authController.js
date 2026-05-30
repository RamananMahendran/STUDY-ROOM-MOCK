import User from './User.js'; // Path adjusted to local folder structure
import generateToken from './generateToken.js'; // Path adjusted to local folder structure
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const emailExists = await User.findByEmail(email);
        const usernameExists = await User.findByUsername(username);
        if (emailExists || usernameExists) {
            res.status(400);
            throw new Error('User already exists (email or username taken)');
        }
        const user = await User.create({
            username,
            email,
            password,
        });
        if (user) {
            // Send token in response (Pass res structure and user index identifier)
            const token = generateToken(res, user.id);
            res.status(201).json({
                id: user.id,
                username: user.username,
                email: user.email,
                streak: user.streak,
                token,
            });
        }
        else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
    catch (error) {
        next(error);
    }
};
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        if (user && (await User.matchPassword(password, user.password))) {
            const token = generateToken(res, user.id);
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                streak: user.streak,
                token,
            });
        }
        else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
    try {
        // Check if the user parsing pipeline managed by middleware successfully populated the payload context
        if (!req.user || !req.user.id) {
            res.status(401);
            throw new Error('Not authorized, session identifier reference is missing');
        }
        const user = await User.findById(req.user.id);
        if (user) {
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                streak: user.streak,
            });
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    }
    catch (error) {
        next(error);
    }
};
