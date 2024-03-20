import { useState } from 'react';
import { FiUser ,FiFile, FiBookOpen,FiHelpCircle, FiGlobe, FiMail, FiPhone} from 'react-icons/fi';
import { AiOutlineBook,  AiOutlinePrinter } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
import { MdInsertChartOutlined} from 'react-icons/md';
import DashNav from '../components/dashboard/DashNav'
import xymaimg from './xyma.png'
import axios from 'axios';

const DashSettings = () => {

  const [selectedUI, setSelectedUI] = useState('personalInfo') //for UI selection
  const [Name, setName] = useState(''); //query handling->name
  const [Query, setQuery] = useState(''); //query handling->content

  // function to select UI
  const handleButtonClick = (ui) =>
  {
    setSelectedUI(ui);
  };

  // function to download user manual
  const donwloadUserManual = () =>
  {
    const url = '/SensorUserManual.pdf';
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Sensor User Manual';
    anchor.click();
  }

  //function to handle query submit
  const handleQuerySubmit = async (e) =>
  {
    e.preventDefault();

    try
    {
      const response = await axios.post('http://localhost:3001/query', {Name, Query});

      if(!response.status === 201)
      {
        throw new Error('failed to store query');
      }

      alert('We Have Received Your Response!')
      setName('');
      setQuery('');
    }
    catch(error)
    {
      console.log(error);
    }
  };

  const renderUI = () =>
  {
    switch(selectedUI)
    {
      case 'personalInfo':
      return( 

      // personal information code
      <div className='flex flex-col items-center justify-center text-xl font-light h-[75vh]'>
        <div className='mb-4 hover:font-normal duration-200'> 
        Personal Information
        </div>
        <div className='mb-4' >
        <img className='h-12 w-18 hover:scale-110 duration-200 cursor-pointer' onClick={() => {window.open('https://www.xyma.in', '_blank');}} src={xymaimg} alt='/'/>
        </div>
        
        <div className='flex flex-col'>
        <div className='flex mb-4 '>
        <div className='flex items-center hover:font-normal duration-200'>Name </div> 
        <div className='p-1 ml-9 w-40 hover:scale-110 duration-200'>: Xyma Analytics</div> 
        </div>

        <div className='flex mb-4'>
        <div className='flex items-center hover:font-normal duration-200'>Email </div> 
        <div className='p-1 ml-11 w-40 hover:scale-110 duration-200'>: infoxyma.in</div>
        </div>

        <div className='flex mb-4'>
        <div className='flex items-center hover:font-normal duration-200'>Customer </div>
        <div className='p-1 ml-2 w-40 hover:scale-110 duration-200'>: XYCU1</div>
        </div>

        <div className='flex mb-4'>
        <div className='flex items-center hover:font-normal duration-200'>Contact </div> 
        <div className='p-1 ml-6 w-40 hover:scale-110 duration-200'>: 91-9442949347</div>
        </div>
        </div>
      </div>);

      case 'assetInfo':
      return(

        // asset information code
          <>
          <div className='text-xl font-light h-[75vh]'>
            <div className='ml-2'>
              <div className=' text-center hover:font-normal duration-200'> Asset Information</div>
              <div className='h-[40vh] mb-14  mt-4 rounded-lg overflow-hidden'> 
              <iframe title='xyma' width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=230&amp;hl=en&amp;q=Xyma%20Analytics%20Pvt%20Ltd,%20+(Xyma)&amp;t=k&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps devices</a></iframe>
              </div>
            </div>

            <div className='flex'>
              <div className='w-1/2'>
                <div className='ml-2 hover:font-normal duration-200'>Asset Type</div>
                <div className='shadow-lg bg-blue-100 rounded-lg h-10  p-1 ml-2 mt-1 w-3/4 hover:scale-110 duration-200'>Xyma</ div>
              </div>

              <div className='w-1/2'>
                <div className='ml-2 hover:font-normal duration-200'>Location</div>
                <div className='shadow-lg bg-blue-100 rounded-lg h-10 p-1 ml-2 mt-1 w-3/4 hover:scale-110 duration-200 text-xs overflow-auto'>B4-01, 4th Floor, B Block, IITM RESEARCH PARK, Kanagam, Tharamani, Chennai, Tamil Nadu 600113</div>
              </div>
            </div>
         </div>
         </>
      );

      case 'documentation':
      return (

      //documentation code
      <>
      <div className='text-xl font-light text-center mb-2 hover:font-normal duration-200'> Download Documentation </div>
      <div className='flex font-thin'>
        <div className='shadow-lg h-[31vh] w-1/2 p-4 mr-2 mb-2 flex flex-col justify-center items-center bg-blue-100 hover:font-semibold hover:scale-105 cursor-pointer duration-200 rounded-lg' onClick={donwloadUserManual}> <AiOutlineBook size={60}/> User Manual</div>
        <div className='shadow-lg h-[31vh] w-1/2 p-4 ml-2 flex flex-col justify-center items-center bg-blue-100 hover:font-semibold hover:scale-105 cursor-pointer duration-200 rounded-lg' >  <MdInsertChartOutlined size={60}/> Schematic</div>
      </div>

      <div className='font-thin shadow-lg h-[30vh] w-full p-4 mt-2 flex flex-col justify-center items-center bg-blue-100 hover:font-semibold hover:scale-[1.03] cursor-pointer duration-200 rounded-lg'> <AiOutlinePrinter size={60}/> Document</div>
      </>
      );

      case 'support':
      return (

      // support code
      <>
      <div className='text-xl font-light text-center mb-4 hover:font-normal duration-200'> Customer Support</div>
      <div className='flex justify-center mb-4 '><  FaUsers size={60} className='hover:scale-110 duration-200'/></div>

      <form onSubmit={handleQuerySubmit}>
      <div className='mb-2 2xl:mb-4'>
        <input type='text' value={Name} onChange={(e)=> setName(e.target.value)} placeholder='Enter your name...' className='h-[7vh] 2xl:h-[8vh] p-2 w-full rounded-lg font-thin hover:font-normal duration-200 bg-blue-100'/> 
      </div>
      
      <div> 
        <textarea value={Query} onChange={(e)=> setQuery(e.target.value)} placeholder='Write your queries here...' className='h-[25vh] 2xl:h-[35vh]  w-full p-2 rounded-lg font-thin hover:font-normal duration-200 bg-blue-100'></textarea>
      </div>
      
      <div className='text-right  mt-3 '>
              <button type="submit"
              className='border border-black rounded cursor-pointer p-1 bg-gray-700 text-gray-100 hover:bg-gray-600 duration-200 hover:scale-105 '>Submit
              </button>
      </div>
      </form>

      <div className='font-normal flex justify-evenly mt-[5vh] text-xs '>  
        <div className='flex items-center mr-4 cursor-pointer hover:scale-110 duration-200' onClick={() => {window.open('https://www.xyma.in', '_blank');}}><FiGlobe className='mr-1' size={20}/> www.xyma.in</div>
        <div className='flex items-center mr-4 cursor-default hover:scale-110 duration-200'><FiMail className='mr-1' size={20}/> info@xyma.in</div>
        <div className='flex items-center mr-4 cursor-default hover:scale-110 duration-200'><FiPhone className='mr-1' size={20}/> +91-9442949347</div>
      </div>
      </>
      )
      
      default:
      return null
    }
  }
    
  return (
    <div className='max-w-[1640] h-full p-8'>
       <DashNav/>
       <div className='mt-12 grid gap-4 sm:grid-cols-1 lg:grid-cols-2 p-2 '>
          <div className=' font-thin shadow-2xl xxs:h-[50vh] sm:h-[75vh] bg-blue-100 rounded-xl'>
            <div className='grid gap-4 p-4 grid-cols-2'>
              <div className='shadow-lg xxs:h-[21vh] sm:h-[33vh] p-4 flex flex-col justify-center items-center bg-white hover:font-semibold hover:scale-105 cursor-pointer duration-200 rounded-lg' onClick={()=> handleButtonClick('personalInfo')}><FiUser className='mb-2 ' size={60}/>Personal Info </div>
              <div className='shadow-lg xxs:h-[21vh] sm:h-[33vh] flex flex-col justify-center items-center bg-white hover:font-semibold hover:scale-105 cursor-pointer duration-200 rounded-lg' onClick={()=> handleButtonClick('assetInfo')} > <FiFile className='mb-2' size={60}/>Asset Info</div>
              <div className='shadow-lg xxs:h-[21vh] sm:h-[33vh] flex flex-col justify-center items-center bg-white hover:font-semibold hover:scale-105 cursor-pointer duration-200 rounded-lg' onClick={()=> handleButtonClick('documentation')}> <FiBookOpen className='mb-2'  size={60}/>Documentation</div>
              <div className='shadow-lg xxs:h-[21vh] sm:h-[33vh] flex flex-col justify-center items-center bg-white hover:font-semibold hover:scale-105 cursor-pointer duration-200 rounded-lg' onClick={()=> handleButtonClick('support')}><FiHelpCircle className='mb-2' size={60}/>Support</div>
            </div>
          </div>
          <div className='border shadow-2xl bg-white p-4 rounded-xl h-[75vh]'>
              {renderUI()}
          </div>
       </div>
    </div>
  )
}

export default DashSettings