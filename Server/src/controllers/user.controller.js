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

//admin signup controller
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

// get all users details
const getUserDetails = asyncHandler(async(req,res)=>{
  const [users ]= await connection.execute(
    "SELECT id, name, email, contactNum, status from user WHERE role='user' "
  )

  if(!users){
    throw new ApiError(500, "User not exist")
  }
  
  return res.status(200)
  .json(
    new ApiResponse(200, users, "Users data fetched successfully")
  )
})

//update user status
const updateUserStatus = asyncHandler(async(req,res)=>{
  const user = req.body;
  const [updateUserStatus] = await connection.execute(
    "UPDATE user SET status=? WHERE id=?",
    [user.status, user.id]
  )

  if(!updateUserStatus){
    throw new ApiError(500, "Something went wrong")
  }

  return res.status(200)
  .json(
    new ApiResponse(200, {}, "Status of user updated successfully!! ")
  )
})

// check token
const checkToken = asyncHandler(async(req,res)=>{
  return res.status(200)
  .json(
    new ApiResponse(200, "Token Checked")
  )
})

// change password
const changePassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  // Step 1: Fetch user by email
  const [rows] = await connection.execute(
    "SELECT password FROM user WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    throw new ApiError(400, "User not found");
  }

  const hashedPassword = rows[0].password;

  // Step 2: Compare old password with stored hash
  const isMatch = await bcrypt.compare(oldPassword, hashedPassword);
  if (!isMatch) {
    throw new ApiError(400, "Incorrect old password");
  }

  // Step 3: Hash new password
  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  // Step 4: Update password
  const [updateResult] = await connection.execute(
    "UPDATE user SET password = ? WHERE email = ?",
    [newHashedPassword, email]
  );

  if (updateResult.affectedRows === 0) {
    throw new ApiError(500, "Failed to update password");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Password changed successfully")
  );
});

export {signup, login, adminSignup, getUserDetails, updateUserStatus, checkToken, changePassword}