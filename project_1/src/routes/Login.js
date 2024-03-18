import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
//import { Link } from "react-router-dom"
import axios from 'axios'

const Login = () => {

    const [Email, setEmail] = useState();
    const [Password, setPassword] = useState();
    const navigate = useNavigate();

    axios.defaults.withCredentials= true;
    const handleSubmit = (e) =>
    {
        e.preventDefault()
        axios.post('http://localhost:3001/login',{Email,Password})
        .then(result => 
          {
          console.log(result)
          if(result.data.token)
          {
            localStorage.setItem('token',result.data.token);
            navigate(result.data.redirectUrl);
          }
          else{
            window.alert('Invalid Credentials!');
          }
          })
        .catch(err=> console.log(err))
    }


  return (
    <div className='flex h-screen items-center'>
    <div className='flex flex-col justify-center shadow-2xl mx-auto w-80 p-8 rounded-md bg-slate-200'>
      <div className=' text-center mb-4 text-xl font-normal'>
        <h3>LOGIN</h3>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
        <label htmlFor='email' className='text-xl font-light'>Email</label> <br/>
        <input type='email' id='email' placeholder='Enter Email...' autoComplete='off' className=' mb-4 mt-1 rounded-md p-1 w-full font-thin hover:font-normal duration-200' onChange={(e)=> setEmail(e.target.value)} /> <br/>
        <label htmlFor='pass' className='text-xl font-light' >Password</label> <br/>
        <input type='password' id='pass' placeholder='Enter Password...' className='mb-8 mt-1 rounded-md p-1 w-full font-thin hover:font-normal duration-200' onChange={(e)=> setPassword(e.target.value)}/><br/>
        <div className=' text-center mb-4 ' >
          <button  type='submit' className='rounded-md w-full p-1 bg-green-500 text-white hover:bg-green-600 hover:scale-105 duration-200'>Login</button>
        </div>
        </form>

          {/* <div className='mb-4'>
          <p> Don't Have an account?</p>
          </div>
          <Link to='/signup'>
          <div className=' text-center mb-4 '>
          <button className='border border-black w-full rounded-md p-1 bg-white  text-gray-800   hover:bg-gray-300  hover:scale-105 duration-200 '>Sign Up</button>
          </div>
          </Link> */}
        </div>
 
    </div>
    </div>
  )
}

export default Login
