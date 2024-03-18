import React from 'react';
import { useState } from 'react';
import './UpdateObjects.css';

const UpdateObjects = () => {

    const[userInfo, setUserInfo] =useState({name:'',
                                            age:0,
                                            contact:''});
function handleName(event)
{
    setUserInfo(prevUserInfo => ({...prevUserInfo, name: event.target.value}));
};
function handleAge(event)
{
    setUserInfo(prevUserInfo => ({...prevUserInfo, age: event.target.value}));
};
function handleContact(event)
{
    setUserInfo(prevUserInfo => ({...prevUserInfo, contact: event.target.value}));
};

return (
    <div id='container'>
      <h3>User Info:</h3>
      <p>Update Objects using useState</p>
      <hr/>
      <p>Name: {userInfo.name}</p>
      <p>Age: {userInfo.age}</p>
      <p>Contact: {userInfo.contact}</p>

      <input type='text' value={userInfo.name} onChange={handleName}/> <br/>
      <input type='number' value={userInfo.age} onChange={handleAge}/> <br/>
      <input type='text' value={userInfo.contact} onChange={handleContact}/>
    </div>
  )
}

export default UpdateObjects
