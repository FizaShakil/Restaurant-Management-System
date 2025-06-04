import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HeadingMain from "./HeadingMain";
import axiosInstance from '../../axiosInstance'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [counts, setCounts] = useState({
    categorySum: 0,
    productSum: 0,
    billSum: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/dashboard/get-details");
        setCounts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Failed to fetch dashboard counts:", err);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }

  return (
    <>
      <div>
        <h2 className="text-sm font-semibold -mt-5">Welcome, {user?.email}</h2>
        <HeadingMain h={"Dashboard"} />
        <div className="flex text-center justify-evenly text-white">
          <div className="bg-red-800 w-52 h-28 pt-3 rounded-lg shadow-md">
            <h3 className="text-lg font-bold">Total Category</h3>
            <p className="text-3xl mt-2">{counts.categorySum}</p>
          </div>
          <div className="bg-red-800 w-48 h-28 pt-3 rounded-lg shadow-md">
            <h3 className="text-lg font-bold">Total Products</h3>
            <p className="text-3xl mt-2">{counts.productSum}</p>
          </div>
          <div className="bg-red-800 w-48 h-28 pt-3 rounded-lg shadow-md">
            <h3 className="text-lg font-bold">Total Bill</h3>
            <p className="text-3xl mt-2">{counts.billSum}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
