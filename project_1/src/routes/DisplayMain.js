import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DisplayNavbar from '../components/dashboard/DisplayNavbar';
import DisplaySidebar from '../components/dashboard/DisplaySidebar';
import {Chart} from 'react-google-charts'
import {AiOutlineWarning } from "react-icons/ai";
import { FaListUl } from "react-icons/fa";
import { MdOutlineManageHistory } from "react-icons/md";
import { FaThinkPeaks } from "react-icons/fa";
import { AiOutlinePieChart } from "react-icons/ai";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const DisplayMain = () => {

    const [projectData, setProjectData] = useState([]);
    const [projectDataLimit, setProjectDataLimit] = useState([]); // for line chart
    const [pieData, setPieData] = useState([]); //pie chart
    const [activeStatus, setActiveStatus] = useState('ACTIVE'); //activity status
    const [lastUpdated, setLastUpdated] = useState(); //last update
    const [peakValues, setPeakValues] = useState([]); //peak value
    const [leftoverKeys, setLeftoverKeys] = useState(0); //total parameters
    const [limit, setLimit] = useState(25); //for line graph limit
    const [selectedKey, SetSelectedKey] = useState([]); // line graph parameter selection

    const handleLimitChange = (e) =>
    {
        setLimit(parseInt(e.target.value));
    };

    const handleKeyClick = (key) =>
    {
            //SetSelectedKey(key);
            if(selectedKey.includes(key))
            {
                SetSelectedKey(selectedKey.filter((k) => k !== key));
            }
            else
            {
                SetSelectedKey([...selectedKey, key]);
            }
            console.log('selected key name',key);   
    };
    
    useEffect(()=>
    {
        fetchProductData();
        const interval = setInterval(fetchProductData,5000);
        return() =>
        {
            clearInterval(interval);
        };
    },[]);

    //for line graph
    useEffect(()=>
    {
        fetchProductDataLimit();
        const interval = setInterval(fetchProductDataLimit,5000);
        return() =>
        {
            clearInterval(interval);
        };
    },[limit]);
 
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
                //for activity status
                const modifiedData = response.data.data.map(item =>
                    {
                        if(item.Time && typeof item.Time === 'string')
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
                    }
                    else
                    {
                        return item;
                    }});
                
                    checkStatus(modifiedData);
                    
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

    // useEffect(() => {
    //     if (!selectedKey && projectDataLimit.length > 0) {
    //         const keys = Object.keys(projectDataLimit[0])
    //         .filter((key) =>  key !== '_id' && key !== '__v' && key !== 'Time');
    //         SetSelectedKey(keys[0]);
    //     }
    // }, [projectDataLimit]);
    
    // for line graph
    const fetchProductDataLimit = async () =>
    {
        try
        {
            const projectName = localStorage.getItem('Project');
            const response = await axios.post('http://localhost:3001/backend/displayProjectDataLimit',{projectName,limit});
            if(response.data.success)
            {
                setProjectDataLimit(response.data.data);
                console.log('limited data',response.data.data)
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
    }

    // card data code
    let cardData = 'N/A';
    if(projectData && projectData.length > 0)
    {
        cardData = projectData[0];
    }
    console.log('card data',cardData)

    //pie chart code
    useEffect(() => {
        if (projectData.length > 0) {
            const lastProjectData = projectData[0];
            const keysBeforeFilter = Object.keys(lastProjectData);
            const filteredkeys = keysBeforeFilter.filter(key => key !== '_id' && key !== '__v' && key !== 'Time')
            const pieChartData =filteredkeys.map(key => [key, parseFloat(lastProjectData[key])]); 
            setPieData([['Category', 'Value'], ...pieChartData]);
            setLastUpdated(lastProjectData.Time); // for last updated

            const peakValues = findPeakValue(lastProjectData); // for peak value
            setPeakValues(peakValues);

            const leftoverKeys = filteredkeys.length; //total parameters
            setLeftoverKeys(leftoverKeys);
        }
    }, [projectData]);

    console.log('pie data',pieData);

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

      if(timeElapsed > 30) //30 seconds
      {
          setActiveStatus('INACTIVE');
      }
      else
      {
          setActiveStatus('ACTIVE');
      }
      }
    };

    // function to find peak value
    const findPeakValue = (data) =>
    {
        let maxValues = [];  
        let maxValue = -Infinity;
        
        for (const key in data)
        {
            if(data.hasOwnProperty(key) && key !== '_id' && key !== '__v' && key !== 'Time')
            {
                const value = parseFloat(data[key]);

                if(value > maxValue)
                {
                    maxValues = [{key,value}];
                    maxValue = value;
                }
                else if(value === maxValue)
                {
                    maxValues.push({key,value});
                }
            }
        }
        return maxValues;
    }

    //for custom scrollbar
    const customScrollbarStyle = {
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgb(153, 246, 228) transparent',
    };

    //render line chart
    const renderLineChart = () =>
    {
        let keysToRender = selectedKey;
        
        // for default line graph
        if (keysToRender.length === 0 && projectDataLimit.length > 0) {
            const keys = Object.keys(projectDataLimit[0]).filter(
                key => key !== '_id' && key !== '__v' && key !== 'Time'
            );
            keysToRender = [keys[0]];
            SetSelectedKey(keysToRender);
        }

        const data = [['Time', ...keysToRender]];
        projectDataLimit.forEach(item =>{
            //const time = item.Time;
            //data.push([time, parseFloat(item[selectedKey])]);
            const lineData = [item.Time];
            selectedKey.forEach((key) =>{
                lineData.push(parseFloat(item[key] || 0));
            });
            data.push(lineData);
            console.log('line data',lineData);
        });

        return(
            <Chart
            width = {'100%'}
            height = {'100%'}
            chartType = "LineChart"
            //loader = {<div>Loading Chart</div>}
            data = {data}
            options = {{
                hAxis: {
                    //title: '',
                    textStyle:{
                        fontSize: 6,
                    },
                },
                vAxis: {
                    title: '',
                },
            }}
            rootProps = {{'data-testid' : '1'}}
            />
        );
    };

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
                    <div className='sm:flex sm:h-[41vh] 2xl:h-[44vh] xxs:h-screen gap-4 mb-4'>
                        {/* parameter cards */}
                        <div className='sm:w-1/2 xxs:h-1/2 sm:h-full mb-2 grid grid-cols-3 gap-2 p-2 overflow-auto bg-white shadow-lg' style={customScrollbarStyle}>
                            {Object.keys(cardData)
                            .filter(key => key !== '_id' && key !== '__v' && key !== 'Time')
                            .map(key =>(
                                <div key={key} className='flex items-center justify-center h-[15vh] font-medium bg-teal-300 text-gray-700 hover:scale-105 duration-200 cursor-pointer hover:bg-teal-400 shadow-lg  rounded-md'>
                                    {`${key}: ${cardData[key]}`}
                                </div>
                            ))}
                        </div>
                        <div className='sm:w-1/2 xxs:h-1/2 sm:h-full mb-4 flex gap-2'>
                            {/* pie chart */}
                            <div className='w-1/2 bg-white shadow-xl '>
                                <div className='flex justify-center items-center  h-1/6'>
                                    <div className='mr-1'><AiOutlinePieChart size={25} /></div>
                                    <div className='font-medium '>
                                        PIE VISUALIZATION
                                    </div>
                                </div>
                                <div className='h-5/6'>
                                    <Chart chartType='PieChart' width={'100%'} height={'100%'} data={pieData} options={pieOptions}/>
                                </div>
                            </div>
                            <div className='w-1/2 flex flex-col gap-2'>
                                <div className='bg-white h-1/2 flex flex-col gap-2 p-1 shadow-xl'>
                                    <div className='flex h-1/2 gap-1'>
                                        {/* activity status */}
                                        <div className={`w-1/2 flex items-center justify-center text-white cursor-pointer rounded-md font-medium hover:scale-[1.03] duration-200 ${activeStatus === 'ACTIVE' ? ' bg-green-400' : ' bg-red-400 animate-background-blink' }`}>
                                            {
                                            activeStatus === 'ACTIVE' ? 
                                            <div className='mr-1'><IoMdCheckmarkCircleOutline size={25}/></div> :
                                            <div className='mr-1'><AiOutlineWarning size={25}/></div> 
                                            }
                                            <div>{activeStatus}</div>
                                        </div> 
                                        {/* total parameters */}
                                        <div className='bg-blue-400 w-1/2 cursor-pointer rounded-md hover:scale-[1.03] duration-200 text-white p-1 flex flex-col items-center justify-center'>
                                            <div className='flex items-center justify-center'>
                                                <div className='mr-1 flex items-center'><FaListUl size={15}/></div>
                                                <div className='text-xs font-medium flex items-center'>TOTAL PARAMETERS</div>
                                            </div>
                                            <div className='flex justify-center items-center font-bold'>
                                                {leftoverKeys}
                                            </div>
                                        </div>
                                    </div>
                                    {/* last updated */}
                                    <div className='h-1/2 cursor-pointer rounded-md hover:scale-[1.015] duration-200 p-1 text-green-400'>
                                        <div className='flex justify-center font-medium text-xs'>
                                            <div className='mr-1'><MdOutlineManageHistory size={25}/></div>
                                            <div className='flex items-center'>RECENT UPDATE</div>
                                        </div>
                                        <div className='flex justify-center items-center font-bold text-xs'>{lastUpdated}</div>
                                    </div>
                                </div>
                                {/* peak value */}
                                <div className='h-1/2 bg-white overflow-auto p-1 shadow-xl' style={customScrollbarStyle}>
                                    <div className='flex items-center justify-center bg-white'>
                                        <div className='mr-1'><FaThinkPeaks size={20}/></div>
                                        <div className='text-xs font-bold'>PEAK VALUE</div>
                                    </div>
                                    {
                                        peakValues.map((peak, index) =>(
                                            <div key={index} className='bg-teal-300 rounded-md cursor-pointer hover:scale-[1.02] duration-200 h-1/3 mt-2 text-gray-700 flex items-center justify-center font-medium'>
                                                {`${peak.key}: ${peak.value}`}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='sm:flex sm:h-[41vh] 2xl:h-[44vh] xxs:h-screen gap-4 mb-4'>
                        {/* table */}
                        <div className='sm:w-1/2 xxs:h-1/2 sm:h-full mb-2 bg-white shadow-xl overflow-auto' style={customScrollbarStyle}>
                            <table className='w-full'>
                                <thead className='sticky top-0 bg-teal-300'>
                                    <tr>
                                        <th className='border border-black'>S.No</th>
                                        {
                                            projectData.length > 0 && Object.keys(projectData[0])
                                            .filter(key => key !== '_id' && key !== 'Time' && key !== '__v') 
                                            .map((key) => (
                                                <th key={key} className='border border-black'> {key} </th>
                                            ))
                                        }
                                        <th className='border border-black'>Updated At</th>
                                    </tr>
                                </thead>
                                <tbody className='text-xs'>
                                    {
                                        projectData
                                        .map((item,index) => (
                                            <tr key={index}>
                                                <td className='border border-black text-center'>{index + 1}</td>
                                                {Object.keys(item)
                                                .filter(key => !['_id', 'Time', '__v'].includes(key))
                                                .map((key, i) => (
                                                    <td key={i} className='border border-black text-center'>{item[key]}</td>
                                                ))}
                                                <td className='border border-black text-center'>{item.Time}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        {/* line graph */}
                        <div className='sm:w-1/2 xxs:h-1/2 sm:h-full mb-4 bg-white shadow-xl p-2 '>
                            <div className='flex gap-2 justify-around h-[10%]'>
                                <div className='flex gap-2 w-[70%] overflow-auto' style={{scrollbarWidth : 'none'}}>
                                    {
                                        Object.keys(cardData)
                                        .filter(key => key !== '_id' && key !== '__v' && key !== 'Time')
                                        .map((key,index) => (
                                            <div key={key}  className=' text-gray-700 flex text-xs font-medium rounded-md'>
                                                {/* <div className='rounded-full border border-black h-2 w-2 mt-[5px] mr-1'></div> */}
                                                <input id={key} type='checkbox' className='cursor-pointer'
                                                onClick={() =>handleKeyClick(key)}
                                                checked={index === 0 && selectedKey.length === 0 ? true : selectedKey.includes(key)}></input>
                                                <div className='flex items-center'>{`${key}`}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                                {/* graph limit */}
                                <div className='flex justify-center items-center bg-red-500 p-1 rounded-md cursor-pointer hover:scale-105 duration-200'>
                                    <label htmlFor='limit' className='text-xs text-white font-medium mr-1 cursor-pointer'>LIMIT</label>
                                    <select id='limit' value={limit} onChange={handleLimitChange} className='text-xs bg-white rounded-2xl font-medium cursor-pointer'>
                                        <option value='25'>25</option>
                                        <option value='50'>50</option>
                                        <option value='75'>75</option>
                                        <option value='100'>100</option>
                                    </select>
                                </div>
                            </div>
                            {/* render line graph */}
                            <div className='h-[90%]'>
                                {selectedKey && renderLineChart()}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </>
  )
}

export default DisplayMain
