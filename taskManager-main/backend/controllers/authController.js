import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { errorHandler } from '../middleware/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return next(errorHandler(400, 'Kindly fill in all fields!')); // Changed to 400

    const newEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: newEmail });

    if (existingUser) {
      return next(errorHandler(400, 'Email already in use')); // Changed to 400
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Using async bcrypt.hash

    const newUser = new User({
      username,
      email: newEmail,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({
      message: 'User created successfully.',
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Registration failed due to a server error' });
    console.log(err); // Consider using a logger instead of console.log
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, 'Please fill all the fields')); // Changed to 400
    }

    const newEmail = email.toLowerCase();

    const validUser = await User.findOne({ email: newEmail });
    if (!validUser) return next(errorHandler(400, 'Invalid credentials')); // Changed to 400

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(400, 'Invalid credentials')); // Changed to 400

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Added expiry to JWT

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sameSite: 'none',
      })
      .status(200)
      .json({ user: rest, token }); // Changed from 'rest' to 'user' for clarity
  } catch (err) {
    next(err);
  }
};

// Sign user out
export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
