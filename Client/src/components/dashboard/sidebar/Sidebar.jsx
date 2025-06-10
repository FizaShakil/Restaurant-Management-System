import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../Redux/authSlice";
import { Link, useNavigate, Outlet } from "react-router-dom";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      confirm("Are you sure want to logout? ")
      dispatch(logout()); // Clears Redux

       localStorage.removeItem("user");
       localStorage.removeItem("token");
       navigate("/login");
  };

  const isAdmin = user?.role === "admin";

 return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-red-900 text-white w-56 p-5 space-y-4">
        <ul className="space-y-3">
          <li>
            <Link to='/dashboard'>Dashboard</Link>
            </li>
          {isAdmin && 
          <li>
            <Link to='/manage-category'>Manage Category</Link>
          </li>
          }
          {isAdmin && 
          <li>
             <Link to='/manage-product'> Manage Product</Link>
          </li>
            }
            <li>
          <Link to='/manage-order'> Manage Order</Link>
          </li>
          <li>
            <Link to='/viewbill'>View Bill</Link>
          </li>
         {isAdmin && 
          <li>
             <Link to='/manage-users'>Manage Users</Link>
          </li>
            }
          <button onClick={handleLogout} 
          className="hover:bg-red-800 text-black bg-red-100 hover:border-red-800 hover:border-2 duration-300 hover:text-white px-8 mt-2 py-2 rounded">
            Logout
          </button>
        </ul>
      </div>

      {/* Main Content */}
       <div className="flex-1 p-6 bg-gray-100">
        <Outlet /> {/* <- This will render the child route component like Dashboard etc. */}
      </div>
    </div>
  );
};

export default Sidebar