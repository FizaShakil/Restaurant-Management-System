import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='flex flex-row w-full bg-red-800 text-white font-bold py-5 justify-between'>
      <Link to='/'>
            <p className='ml-6 '>Restaurant Management System</p>
     </Link>
        <div className='flex flex-row justify-evenly mr-8'>
            <Link to='/login'>
            <i className='fa-solid fa-user'></i>
            </Link>
        </div>
    </div>
  )
}

export default Navbar