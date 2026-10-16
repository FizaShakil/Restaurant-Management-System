import React, { useState, useEffect } from 'react'
import HeadingMain from '../HeadingMain'
import axiosInstance from '../../../axiosInstance.js'

const ViewBill = () => {
  const [bills, setBills] = useState([])
  const fetchBills = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/bills/get-bills");
      setBills(res.data.data);
    } catch (err) {
      alert("Failed to fetch bills")
      console.error("Failed to fetch bills", err)
    }
  };
  
    const handleDelete = async (id,name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete Bill of ${name} ?`);
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/v1/bills/delete-bill/${id}`, {
        data: { id },
      });
      setBills((prev) =>
        prev.filter((bill) => bill.id !== id)
      );
    } catch (err) {
      alert("Failed to delete bill")
      console.error("Failed to delete bill:", err);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div>
      <HeadingMain h={"View Bill"} />
      <div>
              <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Contact Number</th>
            <th className="p-2 text-left">Payment method</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2 text-left">Get PDF</th>
            <th className="p-2 text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="p-2">{b.name}</td>
              <td className="p-2">{b.email}</td>
              <td className="p-2">{b.contactNum}</td>
              <td className="p-2">{b.paymentMethod}</td>
              <td className="p-2">{b.total}</td>
              <td className="p-2">
                <i className='fa-file fa-solid'></i>
              </td>
              <td>
              <button
                      onClick={() => handleDelete(b.id,b.name)}
                      className="text-red-500 hover:text-red-700 fas fa-trash"
                      title="Delete"
                    >
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default ViewBill