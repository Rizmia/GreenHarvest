import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios";


function Login() {
    const history = useNavigate();
    const [user,setUser] = useState({
      name:"",
      email:"",
      password:"",
      cpassword:"",
      number:"",
  
    }); 
    const handleInputChange = (e) =>{
      const {name,value} = e.target;
      setUser ((prevUser) => ({...prevUser,[name]:value}));
    };
    const handleSubmit = (e) => {
      e.preventDefault();
  
      sendRequest().then(() => {
              alert("Register Success");
              history("/Home");
      }).catch((err) => {
  
        alert(err.message);
      });
    };
  
  const sendRequest = async() => {
    await axios.post("http://localhost:5000/register",{
      name: String(user.name),
      gmail: String(user.gmail),
      password:String(user.password),
      cpassword:String(user.cpassword),
      number:String(user.number),
  
    })
    .then((res) => res.data);
  }

  return (
    <div>
      <h1>Login</h1>
      <form>
            <label>Email Address</label>
            <input type='email' value = {user.email}  onChange={handleInputChange} name='email' required></input><br></br><br></br>
            <label>Password</label>
            <input type='password' value = {user.password}  onChange={handleInputChange} name='password' required></input><br></br><br></br>
      </form>
    </div>
  )
}

export default Login
