import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios";

function SignUp() {

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
      <h1>User Register</h1>
        <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input type='text' value = {user.name} onChange={handleInputChange} name='name' required></input><br></br><br></br>
            <label>Email Address</label>
            <input type='email' value = {user.email}  onChange={handleInputChange} name='email' required></input><br></br><br></br>
            <label>Password</label>
            <input type='password' value = {user.password}  onChange={handleInputChange} name='password' required></input><br></br><br></br>
            <label>confirm Password</label>
            <input type='password' value = {user.cpassword}  onChange={handleInputChange} name='cpassword' required></input><br></br><br></br>
            <label>Phone Number</label>
            <input type='number' value = {user.number}  onChange={handleInputChange} name='number' required></input><br></br><br></br>
        <button>Register</button>
        </form>
    </div>
  )
}

export default SignUp
