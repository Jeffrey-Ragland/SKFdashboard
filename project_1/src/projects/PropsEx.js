function PropsEx(props){
    return(
        <div>
            <p>Name: {props.name}</p>
            <p>Age: {props.age}</p>
            <p>Contact: {props.contact}</p>
        </div>
    )
}

export default PropsEx;


   /* <PropsEx name="user1"  age={30} contact={1234567890}/>
    <PropsEx name="user2" age={20} contact={1234567890}/>
    <PropsEx name="user1" age={30} contact={1234567890}/>*/