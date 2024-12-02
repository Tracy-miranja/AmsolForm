import React from 'react'
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'
import HandleLogout from '../logout';

function Application() {
  return (
    <div className='flex '>
        <div>
            <Sidebar />
        </div>
        <div className='flex flex-col w-screen'>
        <div className='flex p-4 gap-5 bg-blue-800 w-[100%] items-right bg-gradient-to-r from-blue-500 to-[#25b2e6] shadow-2xl'>
        <div className='w-[80%]'></div>
      <Link to="/" className='mt-1 text-white'>Home</Link>
            <HandleLogout />
          </div>
          <div className='flex p-5 flex-col border border-gray-400 h-[100vh]'>
          <h1 className='font-bold'>My applications</h1>
          <p>No application </p>
          </div>
       
        </div>
        
    </div>
  )
}

export default Application