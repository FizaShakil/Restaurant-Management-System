import { asyncHandler } from "../utils/asyncHandler.js";
import connection from '../db/connection.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError}from '../utils/ApiError.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Signup controller
const signup = asyncHandler(async (req, res) => {
  const user = req.body;

  const [existingUsers] = await connection.execute(
    "SELECT email FROM user WHERE email = ?",
    [user.email]
  );

  if (existingUsers.length > 0) {
    throw new ApiError(400, "User Already exists")
  }
  
  //hashing password for security
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const result = await connection.execute(
    "INSERT INTO user (name, contactNum, email, password, status, role) VALUES (?, ?, ?, ?, 'false', 'user')",
    [user.name, user.contactNum, user.email, hashedPassword]
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User registered successfully"));
});

const adminSignup = asyncHandler(async(req,res)=>{
    const user = req.body;

  const [existingUsers] = await connection.execute(
    "SELECT email FROM user WHERE email = ?",
    [user.email]
  );

  if (existingUsers.length > 0) {
    throw new ApiError(400, "User Already exists")
  }
  
  //hashing password for security
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const result = await connection.execute(
    "INSERT INTO user (name, contactNum, email, password, status, role) VALUES (?, ?, ?, ?, 'true', 'admin')",
    [user.name, user.contactNum, user.email, hashedPassword]
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User registered successfully"));
})

// Login controller
const login = asyncHandler(async (req, res) => {
  const user = req.body;

  const [rows] = await connection.execute(
    "SELECT email, password, role, status FROM user WHERE email = ?",
    [user.email]
  );

  if (rows.length === 0) {
    throw new ApiError(401, "Incorrect username or password");
  }

  const dbUser = rows[0];

  // Compare hashed password
  const isPasswordValid = await bcrypt.compare(user.password, dbUser.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect username or password");
  }

  if (dbUser.status === 'false') {
    throw new ApiError(401, "Wait for Admin Approval");
  }

  const payload = {
    email: dbUser.email,
    role: dbUser.role,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  return res.status(200).json(
    new ApiResponse(200, {
      user: payload,
      accessToken: accessToken,
    }, "User logged in successfully")
  );
});

export {signup, login, adminSignup}