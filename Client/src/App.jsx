import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// Auth / Public
import LandingPage from './components/login-signup/LandingPage'
import Login from './components/login-signup/Login'
import Signup from './components/login-signup/Signup'
import Navbar from './components/login-signup/Navbar'
import Footer from './components/login-signup/Footer'

// Layout
import Sidebar from './components/dashboard/sidebar/Sidebar'
import ProtectedRoute from './components/dashboard/ProtectedRoute'

// Overview
import Dashboard from './components/dashboard/Dashboard'
import Analytics from './components/dashboard/analytics/Analytics'

// Operations
import ManageOrder from './components/dashboard/manageOrder/ManageOrder'
import KitchenDisplay from './components/dashboard/kitchenDisplay/KitchenDisplay'
import Tables from './components/dashboard/tables/Tables'

// Menu & Stock
import ManageProduct from './components/dashboard/manageProduct/ManageProduct'
import AddProduct from './components/dashboard/manageProduct/AddProduct'
import ManageCategory from './components/dashboard/manageCategory/ManageCategory'
import AddCategory from './components/dashboard/manageCategory/AddCategory'
import Inventory from './components/dashboard/inventory/Inventory'
import Suppliers from './components/dashboard/suppliers/Suppliers'

// Business
import ViewBill from './components/dashboard/viewBill/ViewBill'
import Expenses from './components/dashboard/expenses/Expenses'
import Customers from './components/dashboard/customers/Customers'
import ManageUsers from './components/dashboard/manageUsers/ManageUsers'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute><Sidebar /></ProtectedRoute>}>
          {/* Overview */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />

          {/* Operations */}
          <Route path="/manage-order" element={<ManageOrder />} />
          <Route path="/kitchen-display" element={<KitchenDisplay />} />
          <Route path="/tables" element={<Tables />} />

          {/* Menu & Stock */}
          <Route path="/manage-product" element={<ManageProduct />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/manage-category" element={<ManageCategory />} />
          <Route path="/addcategory" element={<AddCategory />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/suppliers" element={<Suppliers />} />

          {/* Business */}
          <Route path="/viewbill" element={<ViewBill />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/manage-users" element={<ManageUsers />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
