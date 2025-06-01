import React from 'react'
import LandingPage from './components/login-signup/LandingPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/login-signup/Login'
import Signup from './components/login-signup/Signup'
import Navbar from './components/login-signup/Navbar'
import Footer from './components/login-signup/Footer'


function App() {

  return (
    <>
       <Router>
        <Navbar/>
        <Routes>
          <Route path={'/'} element={<LandingPage/>}/>
          <Route path={'/login'} element={<Login/>}/>
          <Route path={'/signup'} element={<Signup/>}/>
        </Routes>
        <Footer/>
       </Router>
    </>
  )
}

export default App
