import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RxDashboard } from "react-icons/rx";
import { IoBarChartOutline } from "react-icons/io5";
import { GrDocumentDownload } from "react-icons/gr";
import { TbRouteSquare } from "react-icons/tb";
import { LiaToolsSolid } from "react-icons/lia";
import { useState } from 'react';

const DisplaySidebar = () => {

    const [dashHover, setDashHover] = useState(false);
    const [graphHover, setGraphHover] = useState(false);
    const [reportHover, setReportHover] = useState(false);
    const [routeHover, setRouteHover] = useState(false);
    const [settingsHover, setSettingsHover] = useState(false);

    const location = useLocation();
  return (
    <div className='flex flex-col bg-gray-600 h-full text-gray-100'>

      <Link to='/displayMain' className={`h-1/5 p-2 hover:bg-gray-800 duration-200 flex items-center ${location.pathname === '/displayMain' && 'bg-gray-800'}`} onMouseEnter={()=> setDashHover(true)} onMouseLeave={()=>setDashHover(false)}>
        <div><RxDashboard size={25} /></div>
        {dashHover && (
            <div className='absolute ml-9 bg-gray-600 p-1 rounded-full text-xs z-10'>
            Dashboard
            </div>
            )}
        </Link>

        <Link to='/displayGraph' className={`h-1/5 p-2 hover:bg-gray-800 duration-200 flex items-center ${location.pathname === '/displayGraph' && 'bg-gray-800'}`} onMouseEnter={()=> setGraphHover(true)} onMouseLeave={()=>setGraphHover(false)}>
        <div >< IoBarChartOutline size={25} /></div>
        {graphHover && (
            <div className='absolute ml-9 bg-gray-600 p-1 rounded-full text-xs z-10'>
            Graphs
            </div>
            )}
        </Link>

        <Link to='/displayReport' className={`h-1/5 p-2 hover:bg-gray-800 duration-200 flex items-center ${location.pathname === '/displayReport' && 'bg-gray-800'}`} onMouseEnter={()=> setReportHover(true)} onMouseLeave={()=>setReportHover(false)}>
        <div ><GrDocumentDownload size={25} /></div>
        {reportHover && (
            <div className='absolute ml-9 bg-gray-600 p-1 rounded-full text-xs z-10'>
            Reports
            </div>
            )}
        </Link>

        <Link to='/displayRoutePage' className={`h-1/5 p-2 hover:bg-gray-800 duration-200 flex items-center ${location.pathname === '/displayRoutePage' && 'bg-gray-800'}`} onMouseEnter={()=> setRouteHover(true)} onMouseLeave={()=>setRouteHover(false)}>
        <div ><TbRouteSquare size={25} /></div>
        {routeHover && (
            <div className='absolute ml-9 bg-gray-600 p-1 rounded-full text-xs z-10'>
            Routes
            </div>
            )}
        </Link>

        <Link to='/displaySettings' className={`h-1/5 p-2 hover:bg-gray-800 duration-200 flex items-center ${location.pathname === '/displaySettings' && 'bg-gray-800'}`} onMouseEnter={()=> setSettingsHover(true)} onMouseLeave={()=>setSettingsHover(false)}>
        <div ><LiaToolsSolid size={25} /></div>
        {settingsHover && (
            <div className='absolute ml-9 bg-gray-600 p-1 rounded-full text-xs z-10'>
            Settings
            </div>
            )}
        </Link>
    </div>
  )
}

export default DisplaySidebar
