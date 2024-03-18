import './Counter.css';
import { useState } from 'react';
const Counter = () =>
{
    let interval;
    const [count, setCount] = useState(0);
    

    const incrementbutton = () =>
    {
        clearInterval(interval);
        interval = setInterval(()=>
        {
            setCount(prevCount => 
                {
                    if(prevCount<10)
                    {
                    return prevCount +1;
                    }
                    else
                    {
                        clearInterval(interval);
                        return prevCount;
                    }
                });
           

        },250);
       
    }

    const resetbutton = () =>
    {
        
        setCount(prevCount => prevCount = 0);
        clearInterval(interval);
    }

    const decrementbutton = () =>
    
    {
        clearInterval(interval);
        interval = setInterval(()=>
        {
            setCount(prevCount => 
                {
                    if(prevCount>-10)
                    {
                    return prevCount -1;
                    }
                    else
                    {
                        clearInterval(interval);
                        return prevCount;
                    }
                });

        },250);
    }

    return (
        <div className='container'>
            <h3 id="heading">Counter</h3>
            <h4 id="number"> {count} </h4>
            <div className='buttons'>
            <button className='button' id="increase" onClick={incrementbutton}>Increase</button>
            <button className='button' id="reset" onClick={resetbutton}>Reset</button>
            <button className='button' id="decrease" onClick={decrementbutton}>Decrease</button>
            </div>
        </div>
    );
}

export default Counter;