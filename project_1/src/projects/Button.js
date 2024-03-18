
const Button = () =>
{
   
    const handleClick = (e) =>
    {
       e.target.textContent = "clicked1";
       console.log(e);

    }
    const handledoubleClick = (e) =>
    {
       e.target.style.display = "none";
    }


    return(
            <button onClick={(e) => handleClick(e)}
                    onDoubleClick={(e) => handledoubleClick(e) } >Click</button> 
        
    );
}

export default Button;