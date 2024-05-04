import React, { useState, useEffect } from "react";
import axios from "axios";
import DisplayNavbar from "../components/dashboard/DisplayNavbar";
import DisplaySidebar from "../components/dashboard/DisplaySidebar";
import { Line } from "react-chartjs-2";
import { AiOutlineBarChart } from "react-icons/ai";
import { AiOutlineLineChart } from "react-icons/ai";
import ReactSlider from "react-slider";
import { Chart } from "react-google-charts";
import "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart as ChartJS} from 'chart.js';
//import { color } from "html2canvas/dist/types/css/types/color";
ChartJS.register(zoomPlugin);

const DisplayGraph = () => {
  const [checked, setChecked] = useState(false);
  const [projectDataLimit, setProjectDataLimit] = useState([]);
  const [filteredLineChartData, setFilteredLineChartData] = useState([]);
  const [limit, setLimit] = useState(25);
  const [selectedKey, SetSelectedKey] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [filteredBarChartData, setFilteredBarChartData] = useState([]);
  const [barSliderValues, setBarSliderValues] = useState([0,100]);
  const [lineSliderValues, setLineSliderValues] = useState([0, 100]);
  const [lineColors, setLineColors] = useState([]);

  //Chart.register(CategoryScale);
  const handleToggle = () => {
    setChecked(!checked);
  };

  const handleBarSliderChange = (value) =>
  {
    setBarSliderValues(value);
  };
  const barMinValue = barSliderValues[0];
  const barMaxValue = barSliderValues[1];

  const handleLineSliderChange = (value) =>
    {
      setLineSliderValues(value);
    }

    const lineMinValue = lineSliderValues[0];
    const lineMaxValue = lineSliderValues[1];

  //line graph limit
  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
  };

  //line graph
  const handleKeyClick = (key) => {
    //SetSelectedKey(key);
    if (selectedKey.includes(key)) {
      SetSelectedKey(selectedKey.filter((k) => k !== key));
    } else {
      SetSelectedKey([...selectedKey, key]);
    }
    //console.log("selected key name", key);
  };

  //for line graph
  useEffect(() => {
    fetchProductDataLimit();
    const interval = setInterval(fetchProductDataLimit, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [limit]);

  // for line graph, bar chart
  const fetchProductDataLimit = async () => {
    try {
      const projectName = localStorage.getItem("Project");
      const response = await axios.post(
        "http://localhost:3001/backend/displayProjectDataLimit",
        { projectName, limit }
      );
      if (response.data.success) {
        setProjectDataLimit(response.data.data);
        //console.log('limited data',response.data.data)
      } else {
        console.log("cant fetch project data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() =>
  {
    setLineColors(getRandomColors(selectedKey.length));
  },[selectedKey]);

  useEffect(() =>
  {
    const filteredLineChartData = projectDataLimit.filter(item =>
      {
        const value = parseFloat(item[selectedKey]);
        return value >= lineMinValue && value <=lineMaxValue;
      }
    );
    setFilteredLineChartData(filteredLineChartData);
  },[projectDataLimit, selectedKey, lineMinValue, lineMaxValue]);

  console.log('line min value',lineMinValue);
  console.log('line max value',lineMaxValue);
  console.log('line chart data',projectDataLimit);
  console.log('filtered line chart data',filteredLineChartData);

  // line chart y axis values
  const generateLineYaxisTicks = () =>
    {
      const ticks = [];
      for (let i = lineMinValue; i<= lineMaxValue; i +=4)
        {
          ticks.push(i);
        }
        console.log('ticks',ticks)
        return ticks;
    }
    
  const renderLineChart = () =>
  {
    let keysToRender = selectedKey;

    // for default line graph
    if (keysToRender.length === 0 && projectDataLimit.length > 0) {
      const keys = Object.keys(projectDataLimit[0]).filter(
        (key) => key !== "_id" && key !== "__v" && key !== "Time"
      );
      keysToRender = [keys[0]];
      SetSelectedKey(keysToRender);
    }

    const data = {
      labels: projectDataLimit.map(item => item.Time),
      datasets: selectedKey.map((key, index) => ({
        label: key,
        data: projectDataLimit.map(item => parseFloat(item[key] || 0)),
        borderColor: lineColors[index], 
        fill: false,
        pointStyle: 'rectRounded',
        pointRadius: 6,
        pointBorderColor: 'rgb(255, 0, 0)'
      }))
    };

    const options = {
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            font: {
              size: 6,
            },
          },
        },
        y: {
          ticks: {
            values: generateLineYaxisTicks(),
            color:'red',
          },
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: "right",
          usePointStyle: true,
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          limits: {
            x: { min: 5, max: 7 },
          },
          zoom: {
            pinch: {
              enabled: true,
            },
            wheel: {
              enabled: true,
            },
            mode: "x",
          },
        },
      },
    };

    //console.log("data", data);
    return (
      <div className="h-full">
        <Line
          data={data}
          height={"100%"}
          options={options}
        />
      </div>
    );
  };

  const getRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(
        `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)})`
      );
    }
    return colors;
  };

  //bar chart code
  useEffect(() => {
    if (projectDataLimit.length > 0) {
      const lastProjectData = projectDataLimit[0];
      const filteredKeys = Object.keys(lastProjectData).filter(
        (key) => key !== "_id" && key !== "__v" && key !== "Time"
      );
      const barChartData = filteredKeys.map((key) => [
        key,
        parseFloat(lastProjectData[key]),
      ]);
      setBarChartData([["Parameters", "Value"], ...barChartData]);
      const filteredBarChartData = barChartData.filter(
        ([key, value]) => value > barMinValue && value <= barMaxValue
      );
      setFilteredBarChartData([
        ["Parameters", "Value"],
        ...filteredBarChartData,
      ]);
    }
  }, [projectDataLimit]);

  // bar chart y axis values
  const generateBarYAxisTicks = () =>
  {
    const ticks = [];
    for (let i = barMinValue; i<= barMaxValue ;i+=4)
    {
        ticks.push(i);
    }
    return ticks;
  }

  //console.log("bar chart data", barChartData);
  //console.log("filtered bar chart data", filteredBarChartData);

  const renderBarChart = () => {
    
    return (
      <div className="h-full">
            <Chart
            width={"100%"}
            height={"100%"}
            chartType="ColumnChart"
            loader={<div>Loading Chart</div>}
            data={filteredBarChartData}
            options={{
              hAxis: {
                title: "Parameters",
              },
              vAxis: {
                ticks: generateBarYAxisTicks(),
                textStyle: {
                  fontSize: 6,
                },
              },
              legend: {
                position: "none",
              }
            }}
          />
      </div>
    );
  };

  return (
    <>
      <div className="flex h-screen">
        {/* left side - sidebar */}
        <div>
          <DisplaySidebar />
        </div>

        {/* right side */}
        <div className="w-full">
          {/* navbar */}
          <div>
            <DisplayNavbar />
          </div>

          {/* main content */}
          <div className="px-2 h-[87%]">
            <div className="flex items-center gap-1 h-[6%]">
              <div className="text-xs font-medium">Bar Chart</div>
              {/* toggle button */}
              <label
                htmlFor="check"
                className="relative bg-white border border-black w-12 h-6 rounded-full cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="check"
                  className="sr-only peer"
                  checked={checked}
                  onChange={handleToggle}
                ></input>
                <span className="w-2/5 h-4/5 bg-amber-700  absolute rounded-full left-1 top-[2px] peer-checked:left-[24px] duration-300 flex items-center justify-center text-white">
                  {checked ? (
                    <AiOutlineLineChart size={15} />
                  ) : (
                    <AiOutlineBarChart size={15} />
                  )}
                </span>
              </label>
              <div className="text-xs font-medium">Line Chart</div>
            </div>

            {/* graph section */}
            {checked ? (
              // line graph
              <div className="h-[94%]">
                <div className="flex gap-2 justify-between h-[6%] bg-white p-1">
                  <div
                    className="flex gap-2 w-[80%] overflow-auto"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {Object.keys(projectDataLimit[0])
                      .filter(
                        (key) =>
                          key !== "_id" && key !== "__v" && key !== "Time"
                      )
                      .map((key, index) => (
                        <div
                          key={key}
                          className=" text-gray-700 flex text-xs font-medium rounded-md"
                        >
                          {/* <div className='rounded-full border border-black h-2 w-2 mt-[5px] mr-1'></div> */}
                          <input
                            id={key}
                            type="checkbox"
                            className="cursor-pointer"
                            onChange={() => handleKeyClick(key)}
                            checked={
                              index === 0 && selectedKey.length === 0
                                ? true
                                : selectedKey.includes(key)
                            }
                          ></input>
                          <div className="flex items-center">{`${key}`}</div>
                        </div>
                      ))}
                  </div>
                  {/* graph limit */}
                  <div className="flex justify-center items-center bg-red-500 p-1 rounded-md cursor-pointer hover:scale-105 duration-200">
                    <label
                      htmlFor="limit"
                      className="text-xs text-white font-medium mr-1 cursor-pointer"
                    >
                      LIMIT
                    </label>
                    <select
                      id="limit"
                      value={limit}
                      onChange={handleLimitChange}
                      className="text-xs bg-white rounded-2xl font-medium cursor-pointer"
                    >
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="75">75</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
                {/* render line graph */}
                <div className="h-[94%] bg-white flex">
                    <div className="flex flex-col items-center justify-center gap-1 text-xs font-medium">
                      <div>MAX</div>
                      <ReactSlider
                        className="w-10 h-[95%] flex justify-center items-center"
                        thumbClassName="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer text-white font-medium text-xs hover:scale-110"
                        trackClassName="w-1 rounded-full bg-gray-300"
                        defaultValue={[0, 100]}
                        renderThumb={(props, state) => (
                          <div {...props}>{state.valueNow}</div>
                        )}
                        pearling
                        minDistance={5}
                        orientation="vertical"
                        invert
                        onChange={(value) => handleLineSliderChange(value)}
                      />
                      <div>MIN</div>
                    </div>
                  <div className="w-full">{selectedKey && renderLineChart()}</div>
                </div>
              </div>
            ) : (
              // bar chart
              <div className="h-[94%] bg-white flex p-6">
                <div className="flex flex-col items-center justify-center gap-1 text-xs font-medium">
                  <div>MAX</div>
                  <ReactSlider
                    className="w-10 h-[65%] flex justify-center items-center"
                    thumbClassName="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer text-white font-medium text-xs hover:scale-110"
                    trackClassName="w-1 rounded-full bg-gray-300"
                    defaultValue={[0, 100]}
                    renderThumb={(props, state) => (
                      <div {...props}>{state.valueNow}</div>
                    )}
                    pearling
                    minDistance={5}
                    orientation="vertical"
                    invert
                    onChange={(value) => handleBarSliderChange(value)}
                  />
                  <div>MIN</div>
                </div>
                <div className="h-full w-full">{renderBarChart()}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayGraph;
