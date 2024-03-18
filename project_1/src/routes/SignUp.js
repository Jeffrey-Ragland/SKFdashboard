import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SignUp = () => {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) =>
    {
        e.preventDefault()
        axios.post('http://localhost:3001/signup',{name,email,pass})
        .then(result => 
          {
          console.log(result)
          navigate('/')
          })
        .catch(err=> console.log(err))
    }

  return (
    <div className='flex flex-col border border-black mx-auto w-80   p-4 mt-32 rounded-md bg-slate-200'>
        <div className=' text-center mb-4 font-semibold'>
        <h3>SIGN UP</h3>
        </div>
      <div>
        <form onSubmit={handleSubmit}>
        <label htmlFor='name'>Name</label> <br/>
        <input type='text' id='name' placeholder='Enter Name' autoComplete='off' className='mb-4 rounded-md p-1 w-full' onChange={(e)=> setName(e.target.value)}/> <br/>
        <label htmlFor='email'>Email</label> <br/>
        <input type='email' id='email' placeholder='Enter Email' autoComplete='off' className=' mb-4 rounded-md p-1 w-full' onChange={(e)=> setEmail(e.target.value)} /> <br/>
        <label htmlFor='pass'>Password</label> <br/>
        <input type='password' id='pass' placeholder='Enter Password' className='mb-6 rounded-md p-1 w-full' onChange={(e)=> setPass(e.target.value)}/><br/>
        <div className=' text-center mb-4 ' >
        <button  type='submit' className='border border-black rounded-md w-full p-1 bg-green-500 text-white hover:bg-green-600 hover:scale-105 duration-200'>Sign Up</button>
      </div>
        </form>
      </div>
     
      <div className='mb-4'>
       <p> Already Have an account?</p>
      </div>
      <Link to='/'>
      <div className=' text-center mb-4 '>
        <button className='border border-black w-full rounded-md p-1 bg-white text-gray-800  hover:bg-gray-300 hover:scale-105 duration-200 '>Login</button>
      </div>
      </Link>
    </div>
  )
}

export default SignUp
