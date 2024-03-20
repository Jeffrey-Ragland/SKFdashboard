import React, {  useState } from 'react'
import {AiOutlineDoubleLeft,AiOutlineDoubleRight, AiOutlineDashboard, AiOutlineFileText, AiOutlineLineChart, AiOutlineLogout, AiOutlineSetting} from 'react-icons/ai'
import { Link } from "react-router-dom"
import xymaimg from './xyma.png'
import skfimg from './skf.png'

const DashNav = () => {
    
const[nav, setNav] = useState(false);

//logout
const handleLogout = () =>
{
    localStorage.removeItem('token');
};

return (
    <div>
    {/* top */}
    <div className='flex justify-between mb-2 ' >
        {/* top left */}
        <div className='flex'>
            <div className='mt-2 hover:scale-125  duration-200'>
                <AiOutlineDoubleRight className=' cursor-pointer' onClick={()=> setNav(!nav)} size={30}/>
            </div>
            <img className='h-12 w-28 ml-3 mt-[3px] cursor-pointer hover:scale-110 duration-200' onClick={() => {window.open('https://www.xyma.in', '_blank');}} src={xymaimg} alt='/'/>
        </div>

        {/* top right */}
        <div>
            <img className='h-12 w-28 ml-3 mt-[3px] cursor-pointer hover:scale-110 duration-200' onClick={() => {window.open('https://www.skf.com', '_blank');}} src={skfimg} alt='/'/>
        </div>
    </div>

    
    {/* overlay */}
    {nav ? <div className=' bg-black/65 fixed w-full h-screen top-0 left-0 z-10'></div> : ''}

    {/*side menu*/}
    <div className={nav ? 'fixed top-0 left-0  h-screen duration-300 bg-blue-50  z-10 w-[220px] ' : 'fixed top-0 left-[-100%] h-screen duration-300 z-10 w-[220px]'} >
        
            <div>
                <AiOutlineDoubleLeft onClick={()=> setNav(!nav)} size={30} className='absolute right-4 top-10 cursor-pointer hover:scale-125 duration-200'/>
            </div>
            <div>
                <img className='h-[50px] w-[120px]  ml-10 mb-4 mt-8 cursor-pointer hover:scale-110 duration-200' onClick={() => {window.open('https://www.skf.com/', '_blank');}} src={skfimg} alt='/'/>
            </div>
        
        <nav>
        <ul className='flex flex-col text-gray-800 p-4'>

            <Link to='/dashmain'>
            <div className='flex hover:bg-blue-200 hover:scale-110 duration-200'>
                <div className='py-4 mr-2'> <AiOutlineDashboard size={30}/> </div>
                <li className='text-xl py-4' >  Dashboard</li>
            </div>
            </Link>

            <Link to='/dashgraph'>
            <div className='flex hover:bg-blue-200 hover:scale-110 duration-200'>
                <div className='py-4 mr-2'> <AiOutlineLineChart size={30}/> </div>
                <li className='text-xl py-4' >  Graph </li>
            </div>
            </Link>

            <Link to='/dashreports'>
            <div className='flex hover:bg-blue-200 hover:scale-110 duration-200'>
                <div className='py-4 mr-2'> <AiOutlineFileText size={30}/> </div>
                <li className='text-xl py-4' >   Reports </li>
            </div>
            </Link>

            <Link to='/dashsettings'>
            <div className='flex hover:bg-blue-200 hover:scale-110 duration-200'>
                <div className='py-4 mr-2'> <AiOutlineSetting size={30}/> </div>
                <li className='text-xl py-4' >   Settings</li>
            </div>
            </Link>
            
            <Link to='/login'>
            <div className='flex hover:bg-blue-200 hover:scale-110 duration-200' onClick={handleLogout}>
                <div className='py-4 mr-2'> <AiOutlineLogout size={30}/> </div>
                <li className='text-xl py-4' > Logout</li>
            </div>
            </Link>
        </ul>
        </nav>
        <div className='ml-4 mt-8 mb-4'>
            &copy; All rights reserved by
        </div>
        <div>
            <img className='h-[55px] w-[120px] ml-10 cursor-pointer hover:scale-110 duration-200' onClick={() => {window.open('https://www.xyma.in', '_blank');}} src={xymaimg} alt='/'/>
        </div>
    </div>
    </div>
)
}

export default DashNav