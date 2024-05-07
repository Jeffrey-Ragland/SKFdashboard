import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DisplayNavbar from "../components/dashboard/DisplayNavbar";
import DisplaySidebar from "../components/dashboard/DisplaySidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegFilePdf } from "react-icons/fa6";
import { RiFileExcel2Line } from "react-icons/ri";
import { MdDownload } from "react-icons/md";
import xymaimg from "./xyma.png";
import coverImg from "./pdfcover.jpg";
import disclaimerPage from "./disclaimerPage.jpg";
import { MultiSelect } from "react-multi-select-component";

const DisplayReport = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleFromDate = (date) => {
    setFromDate(date);
    console.log(date);
  };

  const handleToDate = (date) => {
    setToDate(date);
    console.log(date);
  };

  //multi selector
  const options = [
    { label: "Sensor 1", value: 'Sensor 1' },
    { label: "Sensor 2", value: 'Sensor 2' },
    { label: "Sensor 3", value: 'Sensor 3' },
    { label: "Sensor 4", value: 'Sensor 4' },
    { label: "Sensor 5", value: 'Sensor 5' },
    { label: "Sensor 6", value: 'Sensor 6' },
    { label: "Sensor 7", value: 'Sensor 7' },
    { label: "Sensor 8", value: 'Sensor 8' },
    { label: "Sensor 9", value: 'Sensor 9' },
    { label: "Sensor 10", value: 'Sensor 10' },
    { label: "Sensor 11", value: 'Sensor 11' },
    { label: "Sensor 12", value: 'Sensor 12' },
    { label: "Sensor 13", value: 'Sensor 13' },
    { label: "Sensor 14", value: 'Sensor 14' },
    { label: "Sensor 15", value: 'Sensor 15' },
  ];

  const handleMultiSelectorChange = selectedOptions =>
  {
    setSelectedOptions(selectedOptions);
  }

  useEffect(() => {
    fetchProductData();
    const interval = setInterval(fetchProductData, 20000);
    return () => clearInterval(interval);
  }, []);

  const fetchProductData = async () => {
    try {
      const projectName = localStorage.getItem("Project");
      const response = await axios.post(
        "http://localhost:3001/backend/displayProjectData",
        { projectName }
      );
      if (response.data.success) {
        setProjectData(response.data.data);
        console.log("report data", response.data.data);
      } else {
        console.log("cant fetch project data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // for modified and filtered data
  useEffect(() => {
    generateFilteredData();
  }, [fromDate, toDate, projectData]);

  // modify date format and filter data for datepicker
  const generateFilteredData = () => {
    // used to handle the confusion in time format (month and date)
    const modified = projectData.map((item) => {
      const dateParts = item.Time.split(/[,\s:/]+/);
      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const year = parseInt(dateParts[2]);
      let hours = parseInt(dateParts[3]);
      const minutes = parseInt(dateParts[4]);
      const seconds = parseInt(dateParts[5]);
      const meridian = dateParts[6];

      if (meridian === "pm" && hours !== 12) {
        hours += 12;
      }
      const itemDate = new Date(year, month - 1, day, hours, minutes, seconds);

      return { ...item, Time: itemDate };
    });

    setModifiedData(modified);
    //console.log("modified data", modifiedData);

    // filter the data from the backend according to datepicker
    const filtered = modified.filter((item) => {
      const projectDate = item.Time;
      const adjustedToDate = toDate
        ? new Date(toDate.getTime() + 24 * 60 * 60 * 1000)
        : null; // to date is converted to the next day
      return (
        (!fromDate || projectDate >= fromDate) &&
        (!adjustedToDate || projectDate <= adjustedToDate)
      );
    });
    setFilteredData(filtered);
    console.log("filteredData", filtered);
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    const logo = xymaimg;
    const cover = coverImg;
    const disclaimer = disclaimerPage;
    const projectName = localStorage.getItem("Project");

    //pdf table headers
    const headers = [
      "S.No",
      ...Object.keys(filteredData[0]).filter(
        (key) => key !== "_id" && key !== "Time" && key !== "__v"
      ),
      "Updated At",
    ];

    //pdf table data
    const body = filteredData.map((item, index) => {
      const stringTime = item.Time.toString();
      const dateWithoutTimezone = stringTime.split("GMT")[0].trim();
      const rows = [
        index + 1,
        ...Object.keys(item)
          .filter((key) => !["_id", "Time", "__v"].includes(key))
          .map((key) => item[key]),
        dateWithoutTimezone,
      ];
      return rows;
    });

    //cover img
    doc.addImage(cover, "JPG", 0, 0, 210, 297);
    doc.addPage();

    //logo
    doc.addImage(logo, "PNG", 10, 10, 40, 20);

    //table
    doc.autoTable({
      head: [headers],
      body: body,
      startY: 40,
      headerStyles: {
        fillColor: [222, 121, 13],
      },
    });
    doc.addPage();

    //logo
    doc.addImage(logo, "PNG", 10, 10, 40, 20);

    //disclaimer
    doc.addImage(disclaimer, "PNG", 0, 50, 210, 250);
    doc.save(`${projectName}_reports.pdf`);
  };

  // excel download code
  const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const info = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(info, "SensorData.xlsx");
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
          <div className="h-[13%]">
            <DisplayNavbar />
          </div>

          {/* main content */}
          <div className="h-[87%] flex items-center justify-center">
            <div className="sm:w-[250px] md:w-[350px]  2xl:w-[400px] shadow-2xl bg-white">
              {/* top part */}
              <div className="text-sm  font-medium flex justify-between bg-gray-500 text-white">
                <div className="p-2">Download Report</div>
                <div className="p-2 bg-amber-400">
                  <MdDownload size={20} />
                </div>
              </div>
              {/* bottom part */}
              <div className="flex items-center flex-col gap-4 p-6">
                {/* date picker */}
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="mb-1 text-sm font-medium">From:</div>
                    <DatePicker
                      className="rounded-lg border border-black p-1"
                      selected={fromDate}
                      onChange={handleFromDate}
                      dateFormat={"dd/MM/yyyy"}
                      showIcon
                    />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium">To:</div>
                    <DatePicker
                      className="rounded-lg border border-black"
                      selected={toDate}
                      onChange={handleToDate}
                      dateFormat={"dd/MM/yyyy"}
                      showIcon
                    />
                  </div>
                </div>

                {/* multi selector */}
                <div className="w-56">
                  <div className="text-sm font-medium mb-1">
                    Select Parameters
                  </div>
                  <MultiSelect
                    className="border border-black w-full h-32 overflow-auto"
                    options={options}
                    value={selectedOptions}
                    onChange={handleMultiSelectorChange}
                    labelledBy="Select"
                    shouldToggleOnHover={true}
                  />
                </div>

                <div className="flex gap-4">
                  {/* download pdf button */}
                  <div
                    className="flex items-center p-3 rounded-xl text-white bg-red-500  hover:bg-red-600 duration-200 cursor-pointer hover:scale-110"
                    onClick={generatePdf}
                  >
                    <FaRegFilePdf size={25} />
                  </div>

                  {/* download excel button */}
                  <div
                    className="flex flex-col items-center p-3 rounded-xl text-white bg-green-500  hover:bg-green-600 duration-200 cursor-pointer hover:scale-110"
                    onClick={generateExcel}
                  >
                    <RiFileExcel2Line size={25} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayReport;
