import React, {useState, useEffect} from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'
import ReactApexChart from 'react-apexcharts'
import {AiOutlineWarning } from "react-icons/ai";
import { MdFileDownload } from "react-icons/md";
import xymaimg from './xyma.png'
import coverImg from './pdfcover.jpg'
import jsPDF from 'jspdf';
import 'jspdf-autotable'


const DashAdmin = () => {

    
    const [selectedGraph, setSelectedGraph] = useState([]); //graphs
    const [sensorData, setSensorData] = useState({}); // graph data
    const [series, setSeries] = useState([]); //graph options
    const [activeStatus, setActiveStatus] = useState('Active') //activity status
    const[pdfData, setPdfData] = useState([]); //pdf download
    const[tableData, setTableData] = useState([]) //for table


    const handleLogout = () =>
    {
        localStorage.removeItem('token');
    }

    
  // use effect for line graph
  useEffect(() => 
  {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 1000); 
    return () => clearInterval(interval); 
  }, [selectedGraph]);

  //use effect for activity status
  useEffect(() => 
  {
    fetchSensorData2();
    const interval = setInterval(fetchSensorData2, 5000); 
    return () => clearInterval(interval); 
  }, []);

  //use effect for table data
  useEffect(() => 
  {
    fetchSensorData3();
    const interval = setInterval(fetchSensorData3, 5000); 
    return () => clearInterval(interval); 
  }, []);

  // for line graph
  const fetchSensorData = async () =>
  {
    try
    {
      const response = await Promise.all(selectedGraph.map(graph =>
        axios.get(`http://localhost:3001/readSensorAdmin/${graph}`)
        ));
        const newData = {};
        response.forEach((response, index) =>
        {
          const graph = selectedGraph[index];
          if(response.data.success)
          {
            newData[graph] = response.data.data;
          }
          else
          {
            console.log('error fetching data');
          }
        });
        setSensorData(newData);
        console.log(newData);
    }
    catch(error)
    {
      console.log(error);
    }
  };

  // for activity status
  const fetchSensorData2 = async () =>
    {
        try
        {
        const response = await axios.get('http://localhost:3001/read');
        if(response.data.success)
        {
  
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

                // for pdf download  
                
                setPdfData(response.data.data);
                console.log('pdf data',pdfData)
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

  // for table
  const fetchSensorData3 = async () =>
  {
    try
    {
        const response = await axios.get('http://localhost:3001/readLimit')
        
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
  
  //for rendering line graph
  useEffect(() =>
  {
    if(Object.keys(sensorData).length > 0)
    {
      setSeriesData();
    }
    else
    {
      setSeries([]);
    }
  },[sensorData]);


  
  const handleGraphChange = (event) => {
    const graph = event.target.value;

    if(selectedGraph.includes(graph))
    {
      setSelectedGraph(selectedGraph.filter(g => g !== graph));
    }
    else
    {
      setSelectedGraph([...selectedGraph, graph]);
    }

  };
    
    const setSeriesData = () => 
    {

    let newSeries = [];

    selectedGraph.forEach(graph => {
        newSeries.push({
            name: `Sensor ${graph}`,
            data: sensorData[graph].map(data => data[`Sensor${graph}`])
        });
    });
      setSeries(newSeries);
      
      // for time stamp
      const timestamps = sensorData[selectedGraph[0]].map(data => data.Time);
      setOptions(prevOptions =>({
        ...prevOptions,
        xaxis:{
          ...prevOptions.xaxis,
          categories: timestamps
        }
      }));
    };

    // line graph code

    const [options, setOptions] = useState(
      {
        colors: ['#FF0000','#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          categories: [],

          title: {
            text: ''
          },
          labels: {
            style: {
              fontSize: '8px',
            }
          }

        },
        yaxis: {
          title: {
            text: 'Temperature (°C)'
          }
        },
        legend: {
          position: 'right',
          // offsetY: 0,
          // itemMargin: {
          //   vertical: 0
          // }
        }
      }
    );

    // for pdf download
    const generatepdf = () =>
    {
      const doc = new jsPDF();
      const img = xymaimg;
      const cover = coverImg;

      //cover img
      doc.addImage(cover,'JPG',0,0,210,297);

      doc.addPage();

      //logo
      doc.addImage(img, 'PNG', 10,10,40,20 );

      doc.autoTable({
          head: [['S.No','Sensor 1','Sensor 2','Sensor 3','Sensor 4','Sensor 5','Created At']],
          body: pdfData.map(({Sensor1,Sensor2,Sensor3,Sensor4,Sensor5,Time},index)=>[index + 1, Sensor1,Sensor2,Sensor3,Sensor4,Sensor5,Time]),
          startY: 40,
          headerStyles: {
            fillColor: [222, 121, 13]
        }
      });
      doc.save('sensor_adminData.pdf');
      

    };

    const customScrollbarStyle = {
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(0, 0, 0, 0.3) transparent',
    };


  return (
    <div className='p-3'>
      {/* top */}
      <div className='flex justify-between mb-2 mt-2'>
          {/* top left */}
          <div className='flex'>
              <img className='h-12 w-[100px] ml-3  cursor-pointer hover:scale-110 duration-200' onClick={() => {window.open('https://www.xyma.in', '_blank');}} src={xymaimg} alt='/'/>
          </div>

          {/* top right */}
          <Link to='/login'>
              <div onClick={handleLogout} className='h-10 mt-[2px] p-2 flex items-center rounded-lg bg-red-600 text-white  hover:scale-110 duration-200 font-medium'>
                  Logout
              </div>
          </Link>
      </div>

      {/* check boxes */}

      <div className='mt-4 w-full xs:flex justify-between'>
         
         <div className='flex ml-5 gap-1'>
            {[1,2, 3, 4, 5].map(graph => (
                    <div key={graph} className='flex items-center p-1 h-8 rounded-lg mb-4 text-white bg-orange-400 hover:bg-orange-500 cursor-pointer hover:scale-105 duration-200 text-xs'>
                        <input
                            type='checkbox'
                            id={graph}
                            value={graph}
                            checked={selectedGraph.includes(graph.toString())}
                            onChange={handleGraphChange}
                      
                            className=' opacity-0  absolute cursor-pointer'
                        />
                        <label htmlFor={graph} className='font-semibold cursor-pointer'>Sensor {graph}</label>
                    </div>
                ))}
          </div>

          {/* activity status and pdf button */}

          <div className='flex items-start'>
            <div className={`flex items-center h-8 p-2 ml-5 text-white cursor-pointer rounded-md text-xs font-medium hover:scale-110 duration-200 ${activeStatus === 'Active' ? ' bg-green-400' : ' bg-red-400 animate-background-blink' }`}>
              <div><AiOutlineWarning size={25}/></div>
              <div>{activeStatus}</div>
            </div>
            <div className='flex items-center bg-blue-600 h-8 p-2 ml-2 text-white cursor-pointer rounded-md text-xs font-medium hover:scale-110 duration-200' onClick={generatepdf}>
              <div><MdFileDownload size={25}/></div>
              <div className=''>PDF</div>
            </div>
          </div>    
      </div>

      {/* line graph */}
      <div className='cursor-pointer'>
        <div>
          <h3 className='text-center font-semibold'> Sensor Temperature Variation</h3>
          <div className='h-[290px] 2xl:h-[500px]'>
          <ReactApexChart options={options} series={series} type='line' height={'100%'}/>
          </div>
        </div>
      </div>

      {/* table conetnt */}

      <div className='w-full h-[172px] 2xl:h-[250px] mt-4 overflow-auto' style={customScrollbarStyle} >
        
        <h3 className='text-center font-medium mb-2'>Sensor Data</h3>
        
        
        <table className='w-full'>
          <thead className='sticky top-0'>
            <tr className='border border-black text-center bg-blue-300 '>
              <th className='border border-black hover:bg-blue-400 cursor-pointer'> S.No </th>
              <th className='border border-black hover:bg-blue-400 cursor-pointer'> Sensor 1 </th>
              <th className='border border-black hover:bg-blue-400 cursor-pointer'> Sensor 2 </th>
              <th className='border border-black hover:bg-blue-400 cursor-pointer'> Sensor 3 </th>
              <th className='border border-black hover:bg-blue-400 cursor-pointer'> Sensor 4 </th>
              <th className='border border-black hover:bg-blue-400 cursor-pointer'> Sensor 5 </th>
              <th className='border border-black hover:bg-blue-400 cursor-pointer'> Created At </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) =>
            (
              <tr key={item.id} className='border border-black text-center text-xs'>
                <td className='border border-black bg-blue-300 hover:bg-blue-400 cursor-pointer py-[5px]'> {index + 1} </td>
                <td className='border border-black bg-gray-200 hover:bg-gray-300 hover:cursor-pointer hover:text-base'> {item.Sensor1} </td>
                <td className='border border-black bg-gray-200 hover:bg-gray-300 hover:cursor-pointer hover:text-base'> {item.Sensor2} </td>
                <td className='border border-black bg-gray-200 hover:bg-gray-300 hover:cursor-pointer hover:text-base'> {item.Sensor3} </td>
                <td className='border border-black bg-gray-200 hover:bg-gray-300 hover:cursor-pointer hover:text-base'> {item.Sensor4} </td>
                <td className='border border-black bg-gray-200 hover:bg-gray-300 hover:cursor-pointer hover:text-base'> {item.Sensor5} </td>
                <td className='border border-black bg-gray-200 hover:bg-gray-300 hover:cursor-pointer'> {item.Time} </td>
              </tr>
            ))}
          </tbody>
        </table>
      
      </div>

    </div>
  )
}

export default DashAdmin





// axios.post('http://localhost:3001/logout')
        // .then(response =>
        //     {
        //         localStorage.removeItem('token');
        //     })
        // .catch(error =>
        //     {
        //         console.error('error logging out',error);
        //     })