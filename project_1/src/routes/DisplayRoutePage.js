import React from 'react'
import DisplayNavbar from '../components/dashboard/DisplayNavbar';
import DisplaySidebar from '../components/dashboard/DisplaySidebar';

const DisplayRoutePage = () => {
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
                    display route page
                </div>

            </div>
        </div>
    </>
  )
}

export default DisplayRoutePage
