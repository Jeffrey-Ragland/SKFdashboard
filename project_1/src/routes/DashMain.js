import { FaThermometerHalf } from 'react-icons/fa'
import { AiOutlineCheckCircle, AiOutlineWarning } from "react-icons/ai";
import DashNav from '../components/dashboard/DashNav'
import ReactApexChart from 'react-apexcharts'
import { useState, useEffect } from 'react'
import axios from 'axios'
import CumiModel from '../components/dashboard/CumiModel'
import {Chart} from 'react-google-charts'

const DashMain = () => {

    const [sensorData, setSensorData] = useState(null);//for graph
    const [activeStatus, setActiveStatus] = useState('Active');//for activity status
    const [tableData, setTableData] = useState([]);// for table
    
    //for bar chart
    useEffect(() =>
    {
        fetchSensorData(); 
        const test = setInterval(fetchSensorData,3000)
        return()=>{
            clearInterval(test)
        }
    }, []);

    //for table data
    useEffect(()=>
    {
        fetchSensorData2();
        const interval = setInterval(fetchSensorData2, 5000);
        return () => clearInterval(interval);
    },[]);

    // fetch sensor data from DB
    const fetchSensorData = async () =>
    {
        try
        {
        const response = await axios.get('http://localhost:3001/backend/read');
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

    //for table data
    const fetchSensorData2 = async () =>
    {
    try
    {
        const response = await axios.get('http://localhost:3001/backend/readLimitMain')
        
          if(response.data.success)
          {
            setTableData(response.data.data);
          }
          else
          {
            console.log('error fetching data');
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
            console.log('last data time', lastDataTimestamp)
            console.log('current time',currentTime)
            console.log('time elapsed', timeElapsed)

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
            id: 'basic-bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                columnWidth: '20%',
            }
        },
        xaxis: {
            categories: ['sensor 1','sensor 2','sensor 3','sensor 4','sensor 5',],
            title: {
                    text: ''
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

    //pie chart code
    const pieData = sensorData && sensorData.length > 0 ? [
        ['Sensor', 'Temperature'],
        [`Sensor 1`, sensorData[0].Sensor1],
        [`Sensor 2`, sensorData[0].Sensor2],
        [`Sensor 3`, sensorData[0].Sensor3],
        [`Sensor 4`, sensorData[0].Sensor4],
        [`Sensor 5`, sensorData[0].Sensor5]
    ] : [];
    //console.log('sensorData[0].Sensor5',sensorData.Sensor5)
  
    const pieOptions = {
      
      is3D: true,
      legend:{
          position: 'bottom',
          textStyle:{
              fontSize: 7
          }
      },
      backgroundColor: 'transparent'
    };

    //for custom scrollbar in table
    const customScrollbarStyle = {
        scrollbarWidth: 'thin',
        scrollbarColor: 'orange transparent',
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

        <div className='lg2:flex mt-3 h-full gap-4'>

            {/*bar chart*/}
            <div className='mt-4 h-full sm:w-full lg2:w-1/3 cursor-pointer '>
                    <h3 className='text-center font-semibold '>Components Temperature</h3>
                    <div className='h-[337px] 2xl:h-[600px] shadow-2xl rounded-xl bg-white'>
                    <ReactApexChart options={chartOptions} series={chartData} type='bar' height={'100%'}/>
                    </div>
            </div>

            {/* pie chart */}
            <div className='mt-4 h-full sm:w-full lg2:w-1/3 cursor-pointer '>
                <h3 className='text-center font-semibold '>Pie Representation</h3> 
                <div className='h-[337px] 2xl:h-[600px] shadow-2xl rounded-xl bg-white '>
                    <Chart chartType='PieChart' width={'100%'} height={'100%'} data={pieData} options={pieOptions} />
                </div>
            </div>

            <div className='mt-4 h-full sm:w-full lg2:w-1/3 cursor-pointer'>

                {/* 3d model */}
                <div className='h-1/2 w-full cursor-pointer'>
                    <h3 className=' font-semibold text-center'>
                        3D Model
                    </h3>
                    <div className='w-full h-[160px] 2xl:h-[300px] overflow-auto shadow-2xl rounded-xl bg-white '>
                        {/* <CumiModel/> */}
                    </div>
                </div>

                {/* table */}
                <div className='mt-1 h-[140px] 2xl:h-[290px] w-full cursor-pointer'>
                    <h3 className='text-center font-medium mb-2'>Sensor Data</h3>
                    <div className='h-full overflow-auto shadow-2xl rounded-xl bg-white ' style={customScrollbarStyle}>
                    <table className='w-full'>
                        <thead className='sticky top-0'>
                            <tr className='border border-black text-center bg-orange-400  text-xs'>
                              <th className='border border-black hover:bg-orange-500 cursor-pointer'> S.No </th>
                              <th className='border border-black hover:bg-orange-500 cursor-pointer'> Sensor 1 </th>
                              <th className='border border-black hover:bg-orange-500 cursor-pointer'> Sensor 2 </th>
                              <th className='border border-black hover:bg-orange-500 cursor-pointer'> Sensor 3 </th>
                              <th className='border border-black hover:bg-orange-500 cursor-pointer'> Sensor 4 </th>
                              <th className='border border-black hover:bg-orange-500 cursor-pointer'> Sensor 5 </th>
                              <th className='border border-black hover:bg-orange-500 cursor-pointer'> Created At </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((item, index) =>
                            (
                              <tr key={item.id} className='border border-black text-center text-xs'>
                                <td className='border border-black bg-orange-400 hover:bg-orange-500 cursor-pointer py-[5px]'> {index + 1} </td>
                                <td className='border border-black bg-white hover:bg-gray-200 hover:cursor-pointer hover:text-base'> {item.Sensor1} </td>
                                <td className='border border-black bg-white hover:bg-gray-200 hover:cursor-pointer hover:text-base'> {item.Sensor2} </td>
                                <td className='border border-black bg-white hover:bg-gray-200 hover:cursor-pointer hover:text-base'> {item.Sensor3} </td>
                                <td className='border border-black bg-white hover:bg-gray-200 hover:cursor-pointer hover:text-base'> {item.Sensor4} </td>
                                <td className='border border-black bg-white hover:bg-gray-200 hover:cursor-pointer hover:text-base'> {item.Sensor5} </td>
                                <td className='border border-black bg-white hover:bg-gray-200 hover:cursor-pointer'> {item.Time} </td>
                              </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>  
            </div>
        </div>
    </div> 
  )
}

export default DashMain