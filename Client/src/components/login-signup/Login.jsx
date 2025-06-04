import React, {useState} from 'react';
import { loginSuccess } from '../../Redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import axiosInstance from '../../axiosInstance';

const Login = () => {
   const [form, setForm] = useState({ email: " ", password: " " });
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/v1/users/login", form);
      const { user, accessToken } = res.data.data;

      // Save token to localStorage (optional)
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Save user to Redux
      dispatch(loginSuccess({ user, token: accessToken }));
      navigate("/dashboard");
    } 
    catch (err) {
      alert(err.res?.data?.message || "Login Failed");
      console.log(err)
    }
  };

  return (
    <div className="bg w-full h-screen bg-cover flex items-center justify-center">
      <div className="bg-red-100 bg-opacity-55 p-8 rounded-xl shadow-lg w-11/12 max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-6">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
              placeholder="Enter your email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
              placeholder="Enter your password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-800 text-white p-2 rounded hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account?
          <Link to="/signup" className="text-red-800 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
