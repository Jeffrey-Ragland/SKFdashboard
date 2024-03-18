import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import {saveAs} from 'file-saver'
import xymaimg from './xyma.png'
import coverImg from './pdfcover.jpg'
import DashNav from '../components/dashboard/DashNav'
import { useState, useEffect} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DashReports = () => {
    
    const [sensorData, setSensorData] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    
    const handleFromDate = date =>
    {
        setFromDate(date);
        console.log('fromdate',date)
    };

    const handleToDate = date =>
    {
        setToDate(date);
        console.log('todate',date)
    };

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
                console.log(jsonData.data);
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
   
    // pdf download code
    const generatepdf = () =>
    {
        // used to handle the confusion in time format (month and date)
        const modifiedData = sensorData.map(item =>
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
            })

            console.log('modified data',modifiedData)

        // filter the data from the backend according to datepicker
        const filteredData = modifiedData.filter(sensor => {
            const sensorDate = (sensor.Time);
            const adjustedToDate = toDate ? new Date(toDate.getTime() + (24 * 60 * 60 * 1000)) : null; // to date is converted to the next day
            return (!fromDate || sensorDate >= fromDate) && (!adjustedToDate || sensorDate <= adjustedToDate);
        });

        console.log('filteredData', filteredData)

        const doc = new jsPDF();
        const img = xymaimg;
        const cover = coverImg;

            //cover img
            doc.addImage(cover, 'JPG',0,0,210,297);

            doc.addPage();
        
            //logo
            doc.addImage(img, 'PNG', 10,10,40,20 );

            doc.autoTable({
                head: [['S.No', 'Sensor 1', 'Sensor 2', 'Sensor 3', 'Sensor 4', 'Sensor 5', 'Created At']],
                body: filteredData.map(({ Sensor1, Sensor2, Sensor3, Sensor4, Sensor5, Time }, index) => [index + 1, Sensor1, Sensor2, Sensor3, Sensor4, Sensor5, Time]),
                startY: 40,
            });
            doc.save('sensorData.pdf');
};

    // excel download code 

    const generateExcel = () =>
    {

        const modifiedData = sensorData.map(item =>
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
            })

            console.log('modified data',modifiedData)


        const filteredData = modifiedData.filter(sensor => {
            const sensorDate = (sensor.Time);
            const adjustedToDate = toDate ? new Date(toDate.getTime() + (24 * 60 * 60 * 1000)) : null; // to date is converted to the next day
            
            return (!fromDate || sensorDate >= fromDate) && (!adjustedToDate || sensorDate <= adjustedToDate);
        });

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
        <div className='flex items-center flex-col w-88 shadow-2xl  p-8 bg-slate-200 rounded-lg'>
            <div>
                <h3 className=' mb-2 text-2xl font-thin'>Click to Download Sensor Data</h3>
            </div>

            {/* date picker */}
            <div>
                <div className='mt-4'>
                    <div className='mb-1 text-xl font-thin'>From:</div>
                    <DatePicker selected={fromDate} onChange={handleFromDate} dateFormat={"dd/MM/yyyy"} showIcon/>
                </div>
                <div className='mt-2'>
                    <div className='mb-1 text-xl font-thin'>To:</div>
                    <DatePicker selected={toDate} onChange={handleToDate} dateFormat={"dd/MM/yyyy"} showIcon/>
                </div>
            </div>

            {/* download pdf button */}
            <div className='flex'>
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
