import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../Redux/authSlice";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";

const navGroups = [
  {
    label: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: "fa fa-home" },
      { to: "/analytics", label: "Analytics & Reports", icon: "fa fa-bar-chart" },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/manage-order", label: "Orders / POS", icon: "fa fa-shopping-cart" },
      { to: "/kitchen-display", label: "Kitchen Display", icon: "fa fa-fire" },
      { to: "/tables", label: "Tables & Reservations", icon: "fa fa-table" },
    ],
  },
  {
    label: "Menu & Stock",
    items: [
      { to: "/manage-product", label: "Menu Items & Categories", icon: "fa fa-cutlery", adminOnly: true },
      { to: "/inventory", label: "Inventory & Ingredients", icon: "fa fa-cubes", adminOnly: true },
      { to: "/suppliers", label: "Suppliers & Purchases", icon: "fa fa-truck", adminOnly: true },
    ],
  },
  {
    label: "Business",
    items: [
      { to: "/viewbill", label: "Bills & Payments", icon: "fa fa-file-text" },
      { to: "/expenses", label: "Expenses & Profit", icon: "fa fa-line-chart", adminOnly: true },
      { to: "/customers", label: "Customers", icon: "fa fa-address-book" },
      { to: "/manage-users", label: "Staff & Permissions", icon: "fa fa-id-badge", adminOnly: true },
    ],
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-slate-900 flex flex-col h-full">
        {/* Logo / Brand */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
              <i className="fa fa-cutlery text-white text-sm"></i>
            </div>
            <span className="text-white font-semibold text-base tracking-tight">CafePOS</span>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) => !item.adminOnly || isAdmin);
            if (visibleItems.length === 0) return null;
            return (
              <div key={group.label}>
                <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                          isActive
                            ? "bg-rose-600 text-white"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <i className={`${item.icon} w-4 text-center text-xs`}></i>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-3 pb-4 border-t border-slate-800 pt-3">
          <div className="flex items-center gap-3 px-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
              <i className="fa fa-user text-slate-400 text-xs"></i>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.name || "User"}</p>
              <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-all duration-150"
          >
            <i className="fa fa-sign-out w-4 text-center text-xs"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;
