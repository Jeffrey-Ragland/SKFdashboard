import React from 'react'
import DisplayNavbar from '../components/dashboard/DisplayNavbar';
import DisplaySidebar from '../components/dashboard/DisplaySidebar';

const DisplayGraph = () => {
  return (
    <>
        <div className='flex'>
            {/* left side - sidebar */}
            <div>
                <DisplaySidebar/> 
            </div>

            {/* right side */}
            <div className='w-full'>

                {/* navbar */}
                <div>
                    <DisplayNavbar/>
                </div>
                
                {/* main content */}
                <div>
                    display graph
                </div>

            </div>
        </div>
    </>
  )
}

export default DisplayGraph
