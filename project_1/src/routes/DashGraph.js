import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactApexChart from 'react-apexcharts'
import DashNav from '../components/dashboard/DashNav'

const DashGraph = () => {

  const [selectedGraph, setSelectedGraph] = useState([]);
  const [sensorData, setSensorData] = useState({});
  const [series, setSeries] = useState([]);
  const [limit, setLimit] = useState(30);

  //to handle limit
  const handleLimitChange = (e) =>
  {
    setLimit(parseInt(e.target.value));
  };
 
  // use effect for fetching sensor data from DB 
  useEffect(() => 
  {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 3000); 
    return () => clearInterval(interval); 
  }, [selectedGraph,limit]);

  const fetchSensorData = async () =>
  {
    try
    {
      const response = await Promise.all(selectedGraph.map(graph =>
        axios.get(`http://localhost:3001/readSensor/${graph}?limit=${limit}`)
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
 
  //condition for setting line graph data
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

  //to handle graph selection
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
          },
          toolbar: {
            show: false
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
        legend:{
          position:'right'
        }
      }
    );

  return (
    <div className='flex p-8 flex-col mx-auto'>

      <DashNav />

    {/* checkboxes */}
    <div className=' mt-12 w-full grid justify-around gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
         
            {[1,2, 3, 4, 5].map(graph => (
                    <div key={graph} className='flex justify-center items-center w-28 h-10 rounded-full mb-4 text-white bg-orange-400 hover:bg-orange-500 cursor-pointer hover:scale-110 duration-200'>
                        <input
                            type='checkbox'
                            id={graph}
                            value={graph}
                            checked={selectedGraph.includes(graph.toString())}
                            onChange={handleGraphChange}
                            className='h-6 w-6 mr-2 cursor-pointer'
                        />
                        <label htmlFor={graph} className='font-semibold cursor-pointer'>Sensor {graph}</label>
                    </div>
                ))}

            {/* limit button */}
            <div className=' bg-red-500 hover:bg-red-600 hover:scale-110 p-2 rounded-full text-white font-medium  mb-4 h-10 w-[115px] cursor-pointer duration-200'>
              <label htmlFor='limitSelect' className='cursor-pointer'>Limit</label>
              <select id='limitSelect' value={limit} onChange={handleLimitChange} className='px-1 ml-2 rounded-lg text-black cursor-pointer'>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="100">100</option>
              </select>
            </div>
    </div>

      {/* line graph */}
      <div className='mt-4 cursor-pointer '>
          <h3 className='text-center font-semibold'> Sensor Temperature Variation</h3>
          <div className=' h-[380px] 2xl:h-[600px] shadow-2xl rounded-xl bg-white'>
          <ReactApexChart options={options} series={series} type='line' height={'100%'}/>
          </div>
      </div>
    </div>
  );
}

export default DashGraph