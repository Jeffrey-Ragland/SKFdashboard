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
        
        <div className='h-[18%] flex items-center '>
            <div>
                <img className='h-[50px] w-[120px] ml-10 mr-4 cursor-pointer hover:scale-110 duration-200' onClick={() => {window.open('https://www.skf.com/', '_blank');}} src={skfimg} alt='/'/>
            </div>
            <div>
                <AiOutlineDoubleLeft onClick={()=> setNav(!nav)} size={30} className='cursor-pointer hover:scale-125 duration-200'/>
            </div>
        </div>
        
        <div className='flex flex-col h-[64%] border-b border-t border-black   text-gray-800 p-4'>
            <Link to='/dashmain' className='h-1/5'>
            <div className='flex items-center w-full h-full hover:bg-blue-200 hover:scale-110 duration-200'>
                <div className='py-4 mr-2'> <AiOutlineDashboard size={30}/> </div>
                <div className='text-xl py-4 2xl:text-2xl' > Dashboard</div>
            </div>
            </Link>

            <Link to='/dashgraph' className='h-1/5 '>
            <div className='flex items-center h-full w-full hover:bg-blue-200 hover:scale-110 duration-200'>
                <div className='py-4 mr-2'> <AiOutlineLineChart size={30}/> </div>
                <div className='text-xl py-4 2xl:text-2xl' > Graph </div>
            </div>
            </Link>

            <Link to='/dashreports' className='h-1/5 '>
            <div className='flex items-center h-full w-full hover:bg-blue-200 hover:scale-110 duration-200'>
                <div className='py-4 mr-2'> <AiOutlineFileText size={30}/> </div>
                <div className='text-xl py-4 2xl:text-2xl' > Reports </div>
            </div>
            </Link>

            <Link to='/dashsettings' className='h-1/5 '>
            <div className='flex items-center h-full w-full hover:bg-blue-200 hover:scale-110 duration-200'>
                <div className='py-4 mr-2'> <AiOutlineSetting size={30}/> </div>
                <div className='text-xl py-4 2xl:text-2xl' > Settings</div>
            </div>
            </Link>
            
            <Link to='/login' className='h-1/5 '>
            <div className='flex items-center h-full w-full hover:bg-blue-200 hover:scale-110 duration-200' onClick={handleLogout}>
                <div className='py-4 mr-2'> <AiOutlineLogout size={30}/> </div>
                <div className='text-xl py-4 2xl:text-2xl' > Logout</div>
            </div>
            </Link>
        </div>

        <div className='h-[18%] flex flex-col items-center justify-center'>
            <div className='mb-2 mr-6'>  
                &copy; All rights reserved by
            </div>
            <div>
                <img className='h-[55px] w-[120px] mr-4 cursor-pointer hover:scale-110 duration-200' onClick={() => {window.open('https://www.xyma.in', '_blank');}} src={xymaimg} alt='/'/>
            </div>
        </div>
    </div>
    </div>
)
}

export default DashNav