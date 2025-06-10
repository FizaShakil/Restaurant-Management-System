import React from 'react'
import LandingPage from './components/login-signup/LandingPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/login-signup/Login'
import Signup from './components/login-signup/Signup'
import Navbar from './components/login-signup/Navbar'
import Footer from './components/login-signup/Footer'
import Dashboard from './components/dashboard/Dashboard'
import ProtectedRoute from './components/dashboard/ProtectedRoute'
import ManageCategory from './components/dashboard/manageCategory/ManageCategory'
import ManageProduct from './components/dashboard/manageProduct/ManageProduct'
import ManageOrder from './components/dashboard/manageOrder/ManageOrder'
import ManageUsers from './components/dashboard/manageUsers/ManageUsers'
import ViewBill from './components/dashboard/viewBill/ViewBill'
import Sidebar from './components/dashboard/sidebar/Sidebar'
import AddProduct from './components/dashboard/manageProduct/AddProduct'
import AddCategory from './components/dashboard/manageCategory/AddCategory'


function App() {

  return (
    <>
       <Router>
        <Navbar/>
        <Routes>
          <Route path={'/'} element={<LandingPage/>}/>
          <Route path={'/login'} element={<Login/>}/>
          <Route path={'/signup'} element={<Signup/>}/>
          <Route element={
             <ProtectedRoute>
                <Sidebar/>
            </ProtectedRoute>
        }>
           <Route path="/dashboard" element={<Dashboard/>}/>
           <Route path={'/manage-category'} element={<ManageCategory/>}/>
           <Route path={'/manage-product'} element={<ManageProduct/>}/>
           <Route path={'/manage-order'} element={<ManageOrder/>}/>
           <Route path={'/addorder'} element={<AddProduct/>}/>
           <Route path={'/manage-users'} element={<ManageUsers/>}/>
           <Route path={'/viewbill'} element={<ViewBill/>}/>
           <Route path={'/addproduct'} element={<AddProduct/>}/> 
           <Route path={'/addcategory'}  element={<AddCategory/>}/>
      </Route>
        </Routes>
        <Footer/>
       </Router>
    </>
  )
}

export default App
