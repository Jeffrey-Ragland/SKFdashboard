import React from 'react'
import xymaimg from './xyma.png'
import { Link } from "react-router-dom"
import { useState } from 'react'
import axios from 'axios'

const DashAdmin = () => {

const handleLogout = () =>
{
    localStorage.removeItem('token');
    localStorage.removeItem('Project');
}

const [popupOpen, setPopupOpen] = useState(false);
const [text, setText] = useState('Add Data')
const [parameters, setParameters] = useState(0);

const handlePopup = () =>
{
  setPopupOpen(!popupOpen);

  if(popupOpen)
  {
    setText('Add Data');
  }
  else
  {
    setText('Close');
  }
};

const handleParameters = (e) =>
{
  const value = parseInt(e.target.value);
  setParameters(isNaN(value) ? 0 : value);
}

const handleSubmit = async(e) =>
{
  e.preventDefault();
  try
  {
    //for createproject backend api
    const formData = {
      Project: e.target.projectName.value,
      Email: e.target.email.value,
      Password: e.target.password.value,
      Parameters: parameters,
      ParameterValues: []
    };  
    for (let i = 1; i <= parameters; i++) 
    {
      formData.ParameterValues.push(e.target[`parameter${i}`].value);
    }

    //for query string for insertProjectData backend api
    // const projectName = e.target.projectName.value;
    // const parameterValues = [];
    // for (let i = 1; i <= parameters; i++) {
    //   parameterValues.push(e.target[`parameter${i}`].value);
    // }

    // const queryString = `projectName=${encodeURIComponent(projectName)}&parameterValues=${encodeURIComponent(parameterValues.join(','))}`;
    // console.log('query string',queryString);

    //insert link
    let insertLink = `http://localhost:3001/backend/insertProjectData?projectName=${formData.Project}`;
    formData.ParameterValues.forEach((value, index) => {
      insertLink += `&${value}={insert value}`;
    });
    console.log('insertlink',insertLink)

    const response1 = await axios.post('http://localhost:3001/backend/createproject',formData);
    console.log('formdata',formData);
    if(response1.status === 201)
    {
      console.log("Project added to DB");
    }
    else
    {
      console.log("Failed to add project data");
    }

    // const response2 = await axios.get(`http://localhost:3001/backend/insertProjectData?${queryString}`);
    // if(response2.status === 201)
    // {
    //   console.log("second link success");
    // }
    // else
    // {
    //   console.log("Failed");
    // }
    window.alert(`Insert Link -> ${insertLink}`); // displays the insert link
  }
  catch(error)
  {
    console.log(error);
  }
};

  return (
    <div className='p-4'>
        <div className='flex justify-between'>
            <div className='flex'>
                <img className='h-12 w-[100px] cursor-pointer hover:scale-110 duration-200' onClick={() => {window.open('https://www.xyma.in', '_blank');}} src={xymaimg} alt='/'/>
            </div>
            <Link to='/login'>
                  <div onClick={handleLogout} className='h-10 mt-[2px] p-2 flex items-center rounded-lg bg-red-600 text-white  hover:scale-110 duration-200 font-medium'>
                      Logout
                  </div>
            </Link>
        </div>
        <div className='flex justify-between'>
            <Link to='/skfadmin'>
            <div className='rounded-md cursor-pointer hover:scale-110 w-12 text-center text-lg p-1 duration-200 bg-blue-400 mt-4 text-white font-medium'>
                SKF
            </div>
            </Link>
            <div className='rounded-md w-24 cursor-pointer hover:scale-110 text-lg p-1 text-center duration-200 bg-green-400 mt-4 text-white font-medium' onClick={handlePopup}>
                {text}
            </div>
        </div>
        {/* pop up menu */}
        {popupOpen && (
        <div className='flex justify-end'>
        <div className='shadow-2xl p-8 bg-white mt-4 w-2/3'>
              <div className='text-center mb-4 text-2xl'>
              Enter Project Details
              </div>
              <form className='text-xl font-light' onSubmit={handleSubmit}>
                <div className='flex mb-2'>
                  <label htmlFor='project' className='w-1/2'>Project Name</label>
                  <input type='text' id='project' name='projectName' autoComplete='off' required className='w-1/2 rounded-md px-2 border border-black' ></input>
                </div>
                <div className='flex mb-2'>
                  <label htmlFor='email' className='w-1/2'>Email</label>
                  <input type='text' id='email' name='email' autoComplete='off' required className='border border-black px-2 w-1/2 rounded-md' ></input>
                </div>
                <div className='flex mb-2'>
                  <label htmlFor='password' className='w-1/2'>Password</label>
                  <input type='password' id='password' name='password' required className=' border border-black w-1/2 px-2 rounded-md' ></input>
                </div>
                {/* parameters */}
                <div className='flex mb-2'>
                  <label htmlFor='param' className='w-1/2'>Parameters</label>
                  <input type='number' id='param' name='parameters' required className=' border border-black w-1/2 rounded-md px-2' value={parameters} onChange={handleParameters}></input>
                  
                </div>
                {/* dynamic parameter content */}
                <div className='overflow-auto h-32 2xl:h-96 mb-2 rounded-md border border-red-400 p-2' style={{ scrollbarWidth: 'none'}}>
                    {Array.from({length: parameters}, (_,index)=>index+1).map(parameterIndex =>
                    (
                      <div className='flex mb-1' key={parameterIndex}>
                        <label className='w-1/2' htmlFor={`parameter${parameterIndex}`}>Parameter {parameterIndex}</label>
                        <input type='text' id={`parameter${parameterIndex}`} name={`parameter${parameterIndex}`} autoComplete='off' required className='border border-black w-1/2 rounded-md px-2' ></input>
                      </div>
                    ))}
                </div>
                  
                  <div className='flex justify-end'>
                    <button type='submit' className='rounded-md p-1 bg-green-400 text-white hover:scale-110 duration-200'>Submit</button>
                  </div>
              </form>
            </div>
            </div>
        )}
    </div>
  )
}

export default DashAdmin
