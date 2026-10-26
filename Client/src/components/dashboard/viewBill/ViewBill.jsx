import React, { useState, useEffect } from "react";
import HeadingMain from "../HeadingMain";
import axiosInstance from "../../../axiosInstance.js";

const ViewBill = () => {
  const [bills, setBills] = useState([]);

  const fetchBills = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/bills/get-bills");
      setBills(res.data.data);
    } catch (err) {
      alert("Failed to fetch bills");
      console.error("Failed to fetch bills", err);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the bill for ${name}?`)) return;
    try {
      await axiosInstance.delete(`/api/v1/bills/delete-bill/${id}`, { data: { id } });
      setBills((prev) => prev.filter((bill) => bill.id !== id));
    } catch (err) {
      alert("Failed to delete bill");
      console.error("Failed to delete bill:", err);
    }
  };

  useEffect(() => { fetchBills(); }, []);

  const paymentBadge = (method) => {
    const styles = {
      Cash: "bg-emerald-50 text-emerald-700",
      "Credit Card": "bg-blue-50 text-blue-700",
      UPI: "bg-violet-50 text-violet-700",
    };
    return styles[method] || "bg-slate-100 text-slate-600";
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <HeadingMain h="View Bills" subtitle="Browse and manage all generated bills" />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {bills.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <i className="fa fa-file-text text-3xl mb-3 block"></i>
            <p className="text-sm">No bills found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th className="text-center">PDF</th>
                  <th className="text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b.id}>
                    <td className="font-medium text-slate-800">{b.name}</td>
                    <td className="text-slate-500 text-sm">{b.email}</td>
                    <td className="text-slate-500 text-sm">{b.contactNum}</td>
                    <td>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${paymentBadge(b.paymentMethod)}`}>
                        {b.paymentMethod}
                      </span>
                    </td>
                    <td className="font-semibold text-slate-800">PKR {b.total}</td>
                    <td className="text-center">
                      <button
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Get PDF"
                      >
                        <i className="fa fa-file-pdf-o"></i>
                      </button>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleDelete(b.id, b.name)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {bills.length > 0 && (
        <p className="text-xs text-slate-400 mt-3 text-right">{bills.length} bill{bills.length !== 1 ? "s" : ""} total</p>
      )}
    </div>
  );
};

export default ViewBill;
