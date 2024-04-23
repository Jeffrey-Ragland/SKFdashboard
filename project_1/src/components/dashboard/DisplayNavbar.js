import React from 'react'
import xymaimg from './xyma.png'
import {Link} from 'react-router-dom'

const DisplayNavbar = () => {

const handleLogout = () =>
{
    localStorage.removeItem('token');
    localStorage.removeItem('Project');
}
  return (
      <div>
        <div className='flex justify-between p-4'>
            <div>
                <img className='h-12 w-[100px] cursor-pointer hover:scale-110 duration-200' onClick={() => {window.open('https://www.xyma.in', '_blank');}} src={xymaimg} alt='/'/>
            </div>
            <Link to='/login'>
                <div onClick={handleLogout} className='h-10 mt-[2px] p-2 flex items-center rounded-lg bg-red-600 text-white  hover:scale-110 duration-200 font-medium'>
                    Logout
                </div>
            </Link>
        </div>
    </div>
  )
}

export default DisplayNavbar
