import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance'

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", contactNum: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/v1/users/signup", form);
      alert("Signup successful. Wait for Admin approval.");
      navigate("/login");
    } 
    catch (err) {
      alert(err.response?.data?.message || "Signup Failed");
      console.log("Error occured during signup: ", err)
    }
  };

  return (
    <div className="bg w-full h-screen bg-cover flex items-center justify-center">
      <div className="bg-red-100 bg-opacity-55 p-8 rounded-xl shadow-lg w-11/12 max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-6">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold ">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
              placeholder="Enter your name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
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
            <label className="block text-sm font-semibold">Contact Number</label>
            <input
              type="tel"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
              placeholder="Enter your contact number"
              onChange={(e) => setForm({ ...form, contactNum: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
              placeholder="Create a password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-800 text-white p-2 rounded hover:bg-red-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-red-800 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
