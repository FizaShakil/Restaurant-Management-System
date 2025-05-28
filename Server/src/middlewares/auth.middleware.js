import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { promisify } from 'util';

const verifyToken = promisify(jwt.verify);

export const authenticateToken = asyncHandler(async (req, res, next) => {
    try {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new ApiError(401, 'Token not provided');
  }
    const decoded = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach decoded payload to request
    next();
  } 
  catch (err) {
    throw new ApiError(403, 'Invalid or expired token');
  }
});

export default authenticateToken
