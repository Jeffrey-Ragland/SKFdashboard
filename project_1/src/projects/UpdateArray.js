import React from 'react'
import { useState } from 'react'

const UpdateArray = () => {

const [cars, setCars] = useState(['swift','alto','800']);

    function addCar()
    {
       const newCar =  document.getElementById("carInput").value;
       setCars(prevCars => [...prevCars, newCar]);
    };


  return (
    <div id='container'>
        <h3> Cars List</h3>
        <p>Update Arrays using useState</p>
        <hr/>
        <ul>
            {cars.map((car, index) => <li key={index}>{car}</li>)}
        </ul>
        <input type='text' id='carInput' placeholder='Enter Car Model' />
        <button onClick={addCar}>Add Car</button> 

      
    </div>
  )
}

export default UpdateArray
