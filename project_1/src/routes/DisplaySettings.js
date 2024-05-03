import React from 'react'
import DisplayNavbar from '../components/dashboard/DisplayNavbar';
import DisplaySidebar from '../components/dashboard/DisplaySidebar';

const DisplaySettings = () => {
  return (
    <>
        <div className='flex h-screen'>
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
                    display settings
                </div>

            </div>
        </div>
    </>
  )
}

export default DisplaySettings
