import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DisplayNavbar from '../components/dashboard/DisplayNavbar';
import DisplaySidebar from '../components/dashboard/DisplaySidebar';

const DisplayMain = () => {

    const [projectData, setProjectData] = useState([]);

    useEffect(()=>
    {
        fetchProductData();
        const interval = setInterval(fetchProductData,5000)
        return() =>
        {
            clearInterval(interval);
        };
    },[]);
    
    const fetchProductData = async () =>
    {
        try
        {
            const projectName = localStorage.getItem('Project');
            const response = await axios.post('http://localhost:3001/backend/displayProjectData',{projectName});
            if(response.data.success)
            {
                setProjectData(response.data.data);
                console.log('response data',response.data.data)
                
            }
            else
            {
                console.log('cant fetch project data');
            }
        }
        catch(error)
        {
            console.log(error);
        }
    };
    console.log('projectdata',projectData);

    let cardData = 'N/A';
    if(projectData && projectData.length > 0)
    {
        cardData = projectData[0];
    }
    console.log('card data',cardData)

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
                <div className='px-2'>
                    <div className='sm:flex sm:h-[41vh] xxs:h-screen gap-4 mb-4'>
                        <div className='sm:w-1/2 xxs:h-1/2 sm:h-full mb-2 grid grid-cols-3 gap-2 p-2 overflow-auto bg-white shadow-lg'>
                            {Object.keys(cardData)
                            .filter(key => key !== '_id' && key !== '__v')
                            .map(key =>(
                                <div key={key} className='flex items-center justify-center h-[15vh] font-medium bg-teal-300 text-gray-700 hover:scale-105 duration-200 cursor-pointer hover:bg-teal-400 shadow-lg '>
                                    {`${key}: ${cardData[key]}`}
                                </div>
                            ))}
                        </div>
                        <div className='sm:w-1/2 xxs:h-1/2 sm:h-full mb-4 flex items-center justify-center bg-white shadow-lg'>
                            N/A
                        </div>
                    </div>
                    <div className='sm:flex sm:h-[41vh] xxs:h-screen gap-4 mb-4'>
                        <div className='sm:w-1/2 xxs:h-1/2 sm:h-full  mb-2 flex items-center justify-center bg-white shadow-lg'>
                            N/A
                        </div>
                        <div className='sm:w-1/2 xxs:h-1/2  sm:h-full  mb-4 flex items-center justify-center bg-white shadow-lg'>
                            N/A
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </>
  )
}

export default DisplayMain
