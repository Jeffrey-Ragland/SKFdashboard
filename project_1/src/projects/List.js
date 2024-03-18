const List = () =>
{
    const username = [  {id:1,name:"user 1", age:20},
                        {id:2,name:"user 2", age:19},
                        {id:3,name:"user 3", age:30},
                        {id:4,name:"user 4", age:35},
                        {id:5,name:"user 5", age:25}];

    const usernameItems = username.map(name => <li key={name.id}>  
                                                        {name.name}: &nbsp; 
                                                        Age:{name.age}</li>);



    return(<ul>{usernameItems}</ul>);
}

export default List;