import jwt from 'jsonwebtoken';
import { errorHandler } from './errorHandler.js';

export const VerifyUser = (req, res, next) => {
  const token = req.cookies.token;
  console.log('Token:', token);

  if (!token)
    return next(errorHandler(401, 'Unauthorized to handle this action'));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden!'));
    console.log('Decoded user from token:', user); // Check here
    req.user = user;
    next();
  });
};
