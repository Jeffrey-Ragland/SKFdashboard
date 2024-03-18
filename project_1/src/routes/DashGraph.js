import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactApexChart from 'react-apexcharts'
import DashNav from '../components/dashboard/DashNav'


const DashGraph = () => {

    const [selectedGraph, setSelectedGraph] = useState([]);
    const [sensorData, setSensorData] = useState({});
    const [series, setSeries] = useState([]);
    
  // use effect for fetching sensor data from DB 
  useEffect(() => 
  {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 1000); 
    return () => clearInterval(interval); 
  }, [selectedGraph]);

  
  const fetchSensorData = async () =>
  {
    try
    {
      const response = await Promise.all(selectedGraph.map(graph =>
        axios.get(`http://localhost:3001/readSensor/${graph}`)
        ));
        //console.log('response 1st',response)
        const newData = {};
        response.forEach((response, index) =>
        {
          const graph = selectedGraph[index];
          //console.log('index',index)
          //console.log('graph',graph)
          if(response.data.success)
          {
            newData[graph] = response.data.data;
            //console.log('response 2nd',response.data.data);
            //console.log('new data array',newData)

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
          }

        },
        yaxis: {
          title: {
            text: 'Temperature (°C)'
          }
        }
      }
    );

    

  return (
    <div className='flex p-8 flex-col mx-auto'>
      <DashNav />

      {/* checkboxes */}

    <div className=' mt-12 w-full grid justify-around gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
         
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
    </div>


      <div className='mt-4 cursor-pointer'>
        
          <h3 className='text-center fo t-semibold'> Sensor Temperature Variation</h3>
          <div className=' h-[400px] 2xl:h-[600px]'>
          <ReactApexChart options={options} series={series} type='line' height={'100%'}/>
          </div>
      </div>

    </div>

    
  );
}

export default DashGraph




// SHORTENED RADIO BUTTON CODE

/* <div className=' mt-12 w-full grid justify-around gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
        {[1, 2, 3, 4, 5].map(graph => (
          <div key={graph} className='flex justify-center  items-center border border-black w-28 h-10 rounded-full mb-4 text-white  bg-orange-400 hover:bg-orange-500 cursor-pointer hover:border-2 hover:scale-110 duration-200'>
            <input type='radio' name='graph' id={graph} value={graph} checked={selectedGraph === graph.toString()} onChange={handleGraphChange} className='h-6 w-6 mr-2 cursor-pointer' />
            <label htmlFor={graph} className='font-semibold cursor-pointer'>Sensor {graph}</label>
          </div>
        ))}
</div> */


// OLD ERROR CODE FOR RENDERING LINE GRAPH

// let series= [];
  // if(selectedGraph === '1')
  //  {
  //    series = [
  //      {
  //        name: 'Temperature',
  //        data: sensorData.map(data => data.Sensor1)
  //      }
  //    ];
  //  }
   
  //  else if(selectedGraph === '2')
  //  {
  //    series = [
  //      {
  //        name: 'Temperature',
  //        data: sensorData.map(data => data.Sensor2)
  //      }
  //    ];
  //  }

  //  else if(selectedGraph === '3')
  //  {
  //    series = [
  //      {
  //        name: 'Temperature',
  //        data: sensorData.map(data => data.Sensor3)
  //      }
  //    ];
  //  }

  //  else if(selectedGraph === '4')
  //  {
  //    series = [
  //      {
  //        name: 'Temperature',
  //        data: sensorData.map(data => data.Sensor4)
  //      }
  //    ];
  //  }

  //  else if(selectedGraph === '5')
  //  {
  //    series = [
  //      {
  //        name: 'Temperature',
  //        data: sensorData.map(data => data.Sensor5)
  //      }
  //    ];
  //  }


  // FETCHSENSORDATA FOR RENDERING SINGLE GRAPH AT A TIME

  // const fetchSensorData = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:3001/readSensor/${selectedGraph}`);
  //     if (response.data.success) 
  //     {
  //       setSensorData(response.data.data);
  //       console.log(response.data.data);
  //     } 
  //     else 
  //     {
  //       console.log("error fetching data");
  //     }
  //   } 
  //   catch (error) 
  //   {
  //     console.log(error);
  //   }
  // };


  // EXTENDED CHECKBOX BUTTON CODE

  /* <div className='flex justify-center  items-center border border-black w-28 h-10  rounded-full mb-4 text-white  bg-orange-400 hover:bg-orange-500 cursor-pointer hover:border-2 hover:scale-110 duration-200'>
            <input type='checkbox' id='1' value='1' checked={selectedGraph === '1'} onChange={handleGraphChange}  className='h-6 w-6 mr-2 cursor-pointer'/>
            <label htmlFor='1' className='font-semibold cursor-pointer'>Sensor 1</label>
            </div>

            <div className=' flex justify-center  items-center border border-black w-28 h-10 rounded-full mb-4 text-white  bg-orange-400 hover:bg-orange-500 cursor-pointer hover:border-2 hover:scale-110 duration-200'>
            <input type='checkbox' id='2' value='2' checked={selectedGraph === '2'} onChange={handleGraphChange} className='h-6 w-6 mr-2 cursor-pointer'/>
            <label htmlFor='2' className='font-semibold cursor-pointer'>Sensor 2</label>
            </div>

            <div className='flex justify-center  items-center border border-black w-28 h-10 rounded-full mb-4 text-white  bg-orange-400 hover:bg-orange-500 cursor-pointer hover:border-2 hover:scale-110 duration-200'>
            <input type='checkbox' id='3' value='3' checked={selectedGraph === '3'} onChange={handleGraphChange} className='h-6 w-6 mr-2 cursor-pointer'/>
            <label htmlFor='3' className='font-semibold cursor-pointer'>Sensor 3</label>
            </div>

            <div className='flex justify-center  items-center border border-black w-28 h-10 rounded-full mb-4 text-white  bg-orange-400 hover:bg-orange-500 cursor-pointer hover:border-2 hover:scale-110 duration-200'>
            <input type='checkbox' id='4' value='4' checked={selectedGraph === '4'} onChange={handleGraphChange} className='h-6 w-6 mr-2 cursor-pointer'/>
            <label htmlFor='4' className='font-semibold cursor-pointer'>Sensor 4</label>
            </div>

            <div className='flex justify-center  items-center border border-black w-28 h-10 rounded-full mb-4 text-white  bg-orange-400 hover:bg-orange-500 cursor-pointer hover:border-2 hover:scale-110 duration-200'>
            <input type='checkbox' id='5' value='5' checked={selectedGraph === '5'} onChange={handleGraphChange} className='h-6 w-6 mr-2 cursor-pointer'/>
            <label htmlFor='5' className='font-semibold cursor-pointer'>Sensor 5</label>
            </div> */

//  OLD USE EFFECT FOR RENDERING SINGLE LINE GRAPH

  // useEffect(() => {
  //   if (sensorData.length > 0) {
  //     setSeriesData();
  //   }
  // }, [sensorData]);