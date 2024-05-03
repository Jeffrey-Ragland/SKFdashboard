import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DisplayNavbar from '../components/dashboard/DisplayNavbar';
import DisplaySidebar from '../components/dashboard/DisplaySidebar';
import {Chart} from 'react-google-charts'
import { AiOutlineBarChart } from "react-icons/ai";
import { AiOutlineLineChart } from "react-icons/ai";

const DisplayGraph = () => {

    const [checked, setChecked] = useState(false);
    const [projectDataLimit, setProjectDataLimit] = useState([]);
    const [limit, setLimit] = useState(25);
    const [selectedKey, SetSelectedKey] = useState([]);
    const [barChartData, setBarChartData] = useState([]);

    const handleToggle = () =>
    {
        setChecked(!checked);
    };

    //line graph limit
    const handleLimitChange = (e) =>
    {
        setLimit(parseInt(e.target.value));
    };

    //line graph
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

    //bar chart code
    useEffect(() =>
    {
        if(projectDataLimit.length > 0)
        {
        const lastProjectData = projectDataLimit[0];
        const filteredKeys = Object.keys(lastProjectData)
                            .filter(key => key !== '_id' && key !== '__v' && key !== 'Time');
        const barChartData = filteredKeys.map(key => [key, parseFloat(lastProjectData[key])]);
        setBarChartData([['Parameters','Value'], ...barChartData]);
        }
    },[projectDataLimit]);
    
    const renderBarChart = () =>
    {
    // let barChartData = [['Parameters', 'Value']];
    // const barData = Object.keys(projectDataLimit.filter(
    //     key => key !== '_id' && key !== '__v' && key !== 'Time'
    // ));
    // console.log('project data limit', projectDataLimit)
    // console.log('bar data',barData)
    // barData.forEach(key =>
    // {
    //     barChartData.push([key, projectDataLimit[0][key]])
    // });
    // console.log('bar chart data',barChartData)
    
    return(
        <div className='h-full'>
            <Chart
            width={'100%'}
            height={'100%'}
            chartType='ColumnChart'
            loader={<div>Loading Chart</div>}
            data={barChartData}
            options={{
                hAxis:{
                    title: 'Parameters'
                },
                legend: {
                position: 'none'
                }
            }}
            />
        </div>
    )
    };

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
                <div className='px-2 h-[87%]'>
                    <div className='flex items-center gap-1 h-[6%]'>
                        <div className='text-xs font-medium'>Bar Chart</div>
                        {/* toggle button */}
                        <label htmlFor='check' className='relative bg-white border border-black w-12 h-6 rounded-full cursor-pointer'>
                            <input 
                            type='checkbox' 
                            id='check' 
                            className='sr-only peer'
                            checked={checked}
                            onChange={handleToggle}></input>
                            <span className='w-2/5 h-4/5 bg-amber-700  absolute rounded-full left-1 top-[2px] peer-checked:left-[24px] duration-300 flex items-center justify-center text-white'>
                                {checked ? <AiOutlineLineChart size={15}/> : <AiOutlineBarChart size={15}/>}
                            </span>
                        </label>
                        <div className='text-xs font-medium'>Line Chart</div>
                    </div>
                    
                    {/* graph section */}
                    {
                        checked ? (
                            // line graph
                            <div className='h-[94%]'>
                                <div className='flex gap-2 justify-between h-[6%] bg-white p-1'>
                                    <div className='flex gap-2 w-[80%] overflow-auto' style={{scrollbarWidth : 'none'}}>
                                        {
                                            Object.keys(projectDataLimit[0])
                                            .filter(key => key !== '_id' && key !== '__v' && key !== 'Time')
                                            .map((key,index) => (
                                                <div key={key} className=' text-gray-700 flex text-xs font-medium rounded-md'>
                                                    {/* <div className='rounded-full border border-black h-2 w-2 mt-[5px] mr-1'></div> */}
                                                    <input id={key} type='checkbox' className='cursor-pointer'
                                                    onChange={() =>handleKeyClick(key)}
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
                                <div className='h-[94%]'>
                                    {selectedKey && renderLineChart()}
                                </div>
                            </div>
                            ) : (
                            // bar chart
                            <div className='h-[94%] bg-white'>
                                {renderBarChart()}
                            </div>
                        )
                    }
                </div>

            </div>
        </div>
    </>
  )
}

export default DisplayGraph
