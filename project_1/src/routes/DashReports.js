import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import {saveAs} from 'file-saver'
import xymaimg from './xyma.png'
import coverImg from './pdfcover.jpg'
import sensorPage from './utmapsPage.jpg'
import disclaimerPage from './disclaimerPage.jpg'
import DashNav from '../components/dashboard/DashNav'
import { useState, useEffect} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DashReports = () => {
    
    const [sensorData, setSensorData] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [modifiedData, setModifiedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    
    //date picker->from date
    const handleFromDate = date =>
    {
        setFromDate(date);
        console.log('fromdate',date)
    };

    //date picker->to date
    const handleToDate = date =>
    {
        setToDate(date);
        console.log('todate',date)
    };

    // fetch data from db
    useEffect(()=>
    {
        fetchSensorData();
        const interval = setInterval(fetchSensorData, 5000); 
        return () => clearInterval(interval); 
    },[])

    // fetch sensor data from db
    const fetchSensorData = async () =>
    {
        try
        {
            const response = await fetch ('http://localhost:3001/read');
            if(response.ok)
            {
                const jsonData = await response.json();
                setSensorData(jsonData.data);
                console.log('sensordata',jsonData.data);
            }
            else
            {
                console.error("cant fetch data");
            }
        }
        catch(error)
        {
            console.error(error);
        }
    };

    // for modified and filtered data
    useEffect(() => {
        generateData();
    }, [fromDate, toDate, sensorData]);

    // modify date format and filter data for datepicker
    const generateData = () =>
    {
        // used to handle the confusion in time format (month and date)
        const modified = sensorData.map(item =>
            {
                const dateParts = item.Time.split(/[,\s:/]+/);
                const day = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]);
                const year = parseInt(dateParts[2]);
                let hours = parseInt(dateParts[3]);
                const minutes = parseInt(dateParts[4]);
                const seconds = parseInt(dateParts[5]);
                const meridian = dateParts[6];

                if(meridian === 'pm' && hours !== 12)
                {
                    hours += 12;
                }
                const itemDate = new Date(year, month -1, day, hours, minutes, seconds);

                return {...item, Time: itemDate}
            });

            setModifiedData(modified);
            console.log('modified data',modifiedData);

            // filter the data from the backend according to datepicker
            const filtered = modified.filter(sensor => {
            const sensorDate = (sensor.Time);
            const adjustedToDate = toDate ? new Date(toDate.getTime() + (24 * 60 * 60 * 1000)) : null; // to date is converted to the next day
            return (!fromDate || sensorDate >= fromDate) && (!adjustedToDate || sensorDate <= adjustedToDate);
        });
        setFilteredData(filtered);
        console.log('filteredData', filtered)
    };

    // pdf download code
    const generatepdf = () =>
    {
        const doc = new jsPDF();
        const logo = xymaimg;
        const cover = coverImg;
        const  desc = sensorPage;
        const disclaimer = disclaimerPage;

        //cover img  
        doc.addImage(cover, 'JPG',0,0,210,297);
        doc.addPage();

        //logo
        doc.addImage(logo, 'PNG', 10,10,40,20 );
        
        //sensor description
        doc.addImage(desc, 'PNG', 0,40,220,250);
        doc.addPage();

        //logo
        doc.addImage(logo, 'PNG', 10,10,40,20 );

        //table
        doc.autoTable({
            head: [['S.No', 'Sensor 1', 'Sensor 2', 'Sensor 3', 'Sensor 4', 'Sensor 5', 'Created At']],
            body: filteredData.map(({ Sensor1, Sensor2, Sensor3, Sensor4, Sensor5, Time}, index) => 
            {
            // to remove the timezone
            const stringTime = Time.toString();
            const dateWithoutTimezone = stringTime.split('GMT')[0].trim();
            return [index + 1, Sensor1, Sensor2, Sensor3, Sensor4, Sensor5, dateWithoutTimezone];
            }),
            startY: 40,
            headerStyles: {
                fillColor: [222, 121, 13]
            }
        });
        doc.addPage();

        //logo
        doc.addImage(logo, 'PNG', 10,10,40,20 );

        //disclaimer
        doc.addImage(disclaimer,'PNG',0,50,210,250)
        doc.save('sensor_reports.pdf');
    };

    // excel download code 
    const generateExcel = () =>
    {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb,ws, 'Sheet1');
        const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type:'array'});
        const info = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        saveAs(info, 'SensorData.xlsx');
    }

  return (
    <div className='max-w-[1640] flex p-8  flex-col'>
        
        <DashNav/>

        <div className='flex justify-center items-center h-[75vh]'>
        <div className='flex items-center flex-col w-88 shadow-2xl p-8 bg-white  rounded-xl'>
            <div>
                <h3 className=' mb-2 text-2xl font-thin'>Download Sensor Data</h3>
            </div>

            {/* date picker */}
            <div>
                <div className='mt-4'>
                    <div className='mb-1 text-xl font-thin'>From:</div>
                    <DatePicker className='bg-blue-100 rounded-lg ' selected={fromDate} onChange={handleFromDate} dateFormat={"dd/MM/yyyy"} showIcon/>
                </div>
                <div className='mt-2'>
                    <div className='mb-1 text-xl font-thin'>To:</div>
                    <DatePicker className='bg-blue-100 rounded-lg' selected={toDate} onChange={handleToDate} dateFormat={"dd/MM/yyyy"} showIcon/>
                </div>
            </div>

            <div className='flex'>
                {/* download pdf button */}
                <div>
                    <button className='flex items-center mt-8 ml-4 p-4 rounded-2xl h-12 text-white text-  bg-red-500  hover:bg-red-600 duration-200 cursor-pointer hover:scale-110' onClick={generatepdf}>Download PDF</button>
                </div>

                {/* download excel button */}
                <div>
                    <button className='flex items-center mt-8 ml-4 mb-4 p-4 rounded-2xl h-12 text-white text-  bg-green-500  hover:bg-green-600 duration-200 cursor-pointer hover:scale-110' onClick={generateExcel}>Download Excel</button>
                </div>
            </div>
        </div>
        </div>
    </div>
  )
};

export default DashReports