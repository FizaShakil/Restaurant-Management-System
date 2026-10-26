import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import HeadingMain from "../HeadingMain";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/users/get-users-details");
      setUsers(res.data.data);
    } catch (err) {
      console.log("Failed to fetch users", err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleStatus = async (user) => {
    try {
      const updatedUser = {
        id: user.id,
        status: user.status === "true" || user.status === true ? "false" : "true",
      };
      await axiosInstance.patch("/api/v1/users/update-user-status", updatedUser);
      fetchUsers();
    } catch (err) {
      console.log("Error updating status", err);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <HeadingMain h="Manage Users" subtitle="View and manage user accounts" />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {users.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <i className="fa fa-users text-3xl mb-3 block"></i>
            <p className="text-sm">No users found.</p>
          </div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium text-slate-800">{u.name}</td>
                  <td className="text-slate-500">{u.email}</td>
                  <td className="text-slate-500">{u.contactNum}</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={u.status === "true"}
                          onChange={() => handleToggleStatus(u)}
                        />
                        <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 relative after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                      <span className={`text-xs font-medium ${u.status === "true" ? "text-emerald-600" : "text-slate-400"}`}>
                        {u.status === "true" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
