import React from 'react'
import { useState } from 'react'

const ToDo = () => 
{
    const[tasks,setTasks] = useState([]);
    const[newTask, setNewTask] = useState('');
    function handleInput(event)
    {
        setNewTask(event.target.value);
    }
    function addTask()
    {
        if(newTask !== "")
        setTasks(prevTasks => [...prevTasks, newTask]);
        setNewTask("");
    }

    function deleteTask(index)
    {
        const afterDelete = tasks.filter((element,i) => i!== index);
        setTasks(afterDelete);
    }

  return (
    <div className=' bg-gradient-to-tr from-red-400 to-purple-400  border-black border-2 mx-auto w-80 h-80 p-6 mt-40 overflow-auto'>
        <h3 id='heading' className='text-center mb-3 text-xl'>To-Do List</h3>
        <div>
            <input type='text' className=' border-black border-2 h-9 mb-3'  placeholder='Enter Task...'
            value={newTask} onChange={handleInput}/>
            <button className=' border-black border-2 rounded ml-3 p-1' onClick={addTask}>ADD</button>
            
        </div>
        

        <ul >
            {tasks.map((task,index) => 
            <li key={index}>
               <div id='taskbox' className='border-black border-2 p-1 mb-1 w-60 flex justify-between'> 
                {task} 
                <button id='delbutton' className='border-black border-2 rounded ml-auto p-1 text-xs' onClick={()=>deleteTask(index)}>DELETE</button>
                </div>
            </li>)}
        </ul>
      
    </div>
  )
}

export default ToDo
