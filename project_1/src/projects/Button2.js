import { useState } from "react"
const Button2 = () =>
{
    const [number, setNumber] = useState();
    const number1 = () =>
    {
    setNumber('1');
    }
    const number2 = () =>
    {
    setNumber('2');
    }
    const number3 = () =>
    {
    setNumber('3');
    }


return ( <div>
        <button onClick={number1}>1</button>
        <button onClick={number2}>2</button>
        <button onClick={number3}>3</button>
        <p>{number}</p>
    </div>
)
}

export default Button2;