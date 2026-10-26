import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../axiosInstance";

const statCards = [
  {
    key: "categorySum",
    label: "Total Categories",
    icon: "fa fa-tags",
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    textColor: "text-violet-600",
  },
  {
    key: "productSum",
    label: "Total Products",
    icon: "fa fa-box",
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    textColor: "text-rose-600",
  },
  {
    key: "billSum",
    label: "Total Bills",
    icon: "fa fa-file-text",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [counts, setCounts] = useState({ categorySum: 0, productSum: 0, billSum: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/dashboard/get-details");
        setCounts(response.data.data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch dashboard counts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-slate-500 text-sm font-medium mb-1">
          Welcome back, <span className="text-slate-700 font-semibold">{user?.name || user?.email}</span>
        </p>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-50 text-rose-600 border border-rose-200 rounded-xl px-5 py-4 text-sm font-medium">
          <i className="fa fa-exclamation-circle mr-2"></i>
          Failed to load dashboard data: {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {statCards.map((card) => (
            <div
              key={card.key}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow duration-200"
            >
              <div className={`w-12 h-12 rounded-xl ${card.lightColor} flex items-center justify-center flex-shrink-0`}>
                <i className={`${card.icon} ${card.textColor} text-lg`}></i>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-0.5">{counts[card.key]}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "New Order", icon: "fa fa-plus-circle", to: "/manage-order", color: "text-rose-600" },
            { label: "Add Product", icon: "fa fa-box", to: "/addproduct", color: "text-violet-600" },
            { label: "Add Category", icon: "fa fa-tags", to: "/addcategory", color: "text-blue-600" },
            { label: "View Bills", icon: "fa fa-file-text", to: "/viewbill", color: "text-emerald-600" },
          ].map((action) => (
            <a
              key={action.to}
              href={action.to}
              className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 flex flex-col items-center gap-2 text-center"
            >
              <i className={`${action.icon} ${action.color} text-xl`}></i>
              <span className="text-slate-600 text-xs font-medium">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
