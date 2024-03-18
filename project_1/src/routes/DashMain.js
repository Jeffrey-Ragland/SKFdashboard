import { FaThermometerHalf } from 'react-icons/fa'
import { AiOutlineCheckCircle, AiOutlineWarning } from "react-icons/ai";
import DashNav from '../components/dashboard/DashNav'
import ReactApexChart from 'react-apexcharts'
import { useState, useEffect } from 'react'
import axios from 'axios'
import CumiModel from '../components/dashboard/CumiModel'
//import CameraModel from '../components/dashboard/CameraModel';
//import Sensor3d from '../components/dashboard/Sensor3d';


const DashMain = () => {

    const [sensorData, setSensorData] = useState(null);
    const [activeStatus, setActiveStatus] = useState('Active');
    
    useEffect(() =>
    {
        fetchSensorData(); 
        const test = setInterval(fetchSensorData,1000)
        return()=>{
            clearInterval(test)
        }
    }, []);

    // fetch sensor data from DB
 
    const fetchSensorData = async () =>
    {
        try
        {
        const response = await axios.get('http://localhost:3001/read');
        if(response.data.success)
        {
            setSensorData(response.data.data); // for bar chart
            console.log(response.data.data);

            // for activity status
            const modifiedData = response.data.data.map(item =>
                {
                    const dateParts = item.Time.split(/[,\s:/]+/);
                    const day = parseInt(dateParts[0]); 
                    const month = parseInt(dateParts[1]); 
                    const year = parseInt(dateParts[2]);  
                    let hours = parseInt(dateParts[3]);
                    const minutes = parseInt(dateParts[4]);
                    const seconds = parseInt(dateParts[5]);
                    const meridian = dateParts[6];

                    if (meridian === 'pm' && hours !== 12) {
                        hours += 12;
                    }
    
                    const date = new Date(year, month - 1, day, hours, minutes, seconds);
                    const unixTimestamp = date.getTime();
                    return { ...item, Time: unixTimestamp };
                });
            
                checkStatus(modifiedData); 
    
        }
        else
        {
            console.log('Cant fetch data');
        }
        }
        catch(error)
        {
            console.log(error);
        }

    };


    // function for checking the activity status

    const checkStatus = (data) =>
    {
        if(data.length > 0)
        {
            const lastDataTimestamp = new Date(data[0].Time);
            const currentTime = new Date().getTime();
            const timeElapsed = (currentTime - lastDataTimestamp) / 1000;

        if(timeElapsed > 300)
        {
            setActiveStatus('Inactive');
        }
        else
        {
            setActiveStatus('Active');
        }
        }
    };
    
    /* bar chart code */
    
    let data = "N/A";
    let chartData = [];
    if (sensorData && sensorData.length > 0) {
        data = sensorData[0];
        chartData = [{
            name: 'Temperature',
            data: [
                data.Sensor1,
                data.Sensor2,
                data.Sensor3,
                data.Sensor4,
                data.Sensor5
            ]
        }];
    }

    const chartOptions = {
        chart: {
            id: 'basic-bar'
        },

        plotOptions: {
            bar: {
                columnWidth: '20%',
            }
        },

        xaxis: {
            categories: ['sensor 1','sensor 2','sensor 3','sensor 4','sensor 5',],
            title: {
                    text: 'Sensors'
            }
        },

        yaxis: {
            title: {
                text:'Temperature'
            }

        },

        colors: ["#fa6e32"],

        dataLabels: {
            enabled: false
        },

    };

  return (
    <div className=' flex p-8  flex-col h-full'>
        
        <DashNav/>
        <div className='flex justify-between mt-2 font-light text-2xl '>
            <div>
                Sensor Temperatures
            </div>
            <div className='flex'>
                <div className='flex items-center mr-2 text-xs font-medium cursor-pointer hover:scale-105 duration-200 text-blue-400 '>
                    <AiOutlineCheckCircle size={30} className='mr-1'/> 
                    Total Sensors: 5
                </div>
                <div className={`flex items-center text-xs font-medium cursor-pointer hover:scale-105 duration-200 ${activeStatus === 'Active' ? 'text-green-400' : 'text-red-400 animate-blink'}`}>
                    <AiOutlineWarning size={30} className='mr-1'/>
                    {activeStatus}
                </div>
            </div>
        </div>

        {/* grid components*/}
        <div className='mt-2 grid gap-4 sm:grid-cols-1 md:grid-cols-5 '>
        
            <div className=' rounded-2xl h-20 p-2 flex-col text-white  bg-orange-400 hover:bg-orange-500 duration-200 cursor-pointer hover:scale-105'>
                <div className=' text-center ml-2 mb-1 font-medium'>Sensor 1</div>
                <div className='flex items-center justify-center'>
                    <div><FaThermometerHalf size={30}/></div>  
                    <div>{data.Sensor1}°C</div>
                </div>
            </div>
        
 
            <div className=' rounded-2xl h-20 p-2 flex-col text-white  bg-orange-400 hover:bg-orange-500 duration-200 cursor-pointer hover:scale-105'>
                <div className=' text-center ml-2 mb-1 font-medium'>Sensor 2</div>
                <div className='flex items-center justify-center'>
                    <div><FaThermometerHalf size={30}/></div>  
                    <div>{data.Sensor2}°C</div>
                </div>
            </div>


            <div className=' rounded-2xl h-20 p-2 flex-col text-white  bg-orange-400 hover:bg-orange-500 duration-200 cursor-pointer hover:scale-105'>
                <div className=' text-center ml-2 mb-1 font-medium'>Sensor 3</div>
                <div className='flex items-center justify-center'>
                    <div><FaThermometerHalf size={30}/></div>  
                    <div>{data.Sensor3}°C</div>
                </div>
            </div>

            <div className=' rounded-2xl h-20 p-2 flex-col text-white  bg-orange-400 hover:bg-orange-500 duration-200 cursor-pointer hover:scale-105'>
                <div className=' text-center ml-2 mb-1 font-medium'>Sensor 4</div>
                <div className='flex items-center justify-center'>
                    <div><FaThermometerHalf size={30}/></div>  
                    <div>{data.Sensor4}°C</div>
                </div>
            </div>

            <div className=' rounded-2xl h-20 p-2 flex-col text-white  bg-orange-400 hover:bg-orange-500 duration-200 cursor-pointer hover:scale-105'>
                <div className=' text-center ml-2 mb-1 font-medium'>Sensor 5</div>
                <div className='flex items-center justify-center'>
                    <div><FaThermometerHalf size={30}/></div>  
                    <div>{data.Sensor5}°C</div>
                </div>
            </div>

        </div>

        <div className='lg2:flex mt-3 h-full'>
            {/*bar chart*/}

            <div className='mt-4 h-full sm:w-full lg2:w-1/2 cursor-pointer'>
                <h3 className='text-center font-semibold '>Components Temperature</h3>
                <div className='h-[320px] 2xl:h-[600px] '>
                <ReactApexChart options={chartOptions} series={chartData} type='bar' height={'100%'}/>
                </div>
            </div>

            {/* 3d model */}

            <div className='h-full mt-4 mx-4 ml-4 sm:w-full lg2:w-1/2 cursor-pointer flex flex-col justify-center items-center'>
                <div className=' font-bold '>
                    3D Model
                </div>
                <div className='w-5/6 h-[320px] 2xl:h-[600px] mt-4 mx-4 overflow-auto shadow-2xl'>
                    {/* <CumiModel/> */}
                </div>
            </div>
        </div>
        
       
    </div> 
  )
}

export default DashMain