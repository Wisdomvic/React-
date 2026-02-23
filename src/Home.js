import { useState} from 'react';

const Home = () => {
     //let name = 'maria';
const [name, setName] = useState('mario');
const[age , setAge] = useState(30)
   const handleClick = () => {
       setName('victor');
       setAge(25)
   }

    return ( 
        <div className="home">
            <h2>Homepage</h2>
            <p>{ name} is {age} years old</p>
            <button onClick = {handleClick}>Click me</button>
        </div>
     );
}
 
export default Home;