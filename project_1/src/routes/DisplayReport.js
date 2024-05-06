import React from 'react'
import { useState } from 'react';
import DisplayNavbar from '../components/dashboard/DisplayNavbar';
import DisplaySidebar from '../components/dashboard/DisplaySidebar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DisplayReport = () => {

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

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
          <div className="border border-black h-[87%] flex items-center justify-center">
            <div className="flex items-center flex-col w-88 shadow-2xl p-8 bg-gray-100  rounded-xl">
              <div className=" mb-2 text-2xl font-thin">
                Download Sensor Data
              </div>

              {/* date picker */}
              <div>
                <div className="mt-4">
                  <div className="mb-1 text-xl font-thin">From:</div>
                  <DatePicker
                    className="rounded-lg "
                    selected={fromDate}
                    //onChange={handleFromDate}
                    dateFormat={"dd/MM/yyyy"}
                    showIcon
                  />
                </div>
                <div className="mt-2">
                  <div className="mb-1 text-xl font-thin">To:</div>
                  <DatePicker
                    className="rounded-lg"
                    selected={toDate}
                    //onChange={handleToDate}
                    dateFormat={"dd/MM/yyyy"}
                    showIcon
                  />
                </div>
              </div>

              <div className="flex">
                {/* download pdf button */}
                <div>
                  <button
                    className="flex items-center mt-8 ml-4 p-4 rounded-2xl h-12 text-white text-  bg-red-500  hover:bg-red-600 duration-200 cursor-pointer hover:scale-110"
                    //onClick={generatepdf}
                  >
                    Download PDF
                  </button>
                </div>

                {/* download excel button */}
                <div>
                  <button
                    className="flex items-center mt-8 ml-4 mb-4 p-4 rounded-2xl h-12 text-white text-  bg-green-500  hover:bg-green-600 duration-200 cursor-pointer hover:scale-110"
                    //onClick={generateExcel}
                  >
                    Download Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DisplayReport
