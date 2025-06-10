import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import HeadingMain from "../HeadingMain";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/users/get-users-details");
      setUsers(res.data.data);
    } catch (err) {
      console.log("Failed to fetch users", err)
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle user status
  const handleToggleStatus = async (user) => {
    try {
      const updatedUser = {
          id: user.id,
          status: user.status === "true" || user.status === true ? "false" : "true",
         };

      await axiosInstance.patch("/api/v1/users/update-user-status", updatedUser);
      console.log("Status updated");
      fetchUsers();
    } catch (err) 
    {
      console.log("Error updating status", err);
    }
  };

  return (
    <div className="p-4">
      <HeadingMain h={'Manage Users'}/>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Contact Number</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.contactNum}</td>
              <td className="p-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                   checked={u.status === "true"}
                    onChange={() => handleToggleStatus(u)}
                  />
                 <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  <span className="ml-2 text-sm">
                    {u.status=="true" ? "Enabled" : "Disabled"}
                  </span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
