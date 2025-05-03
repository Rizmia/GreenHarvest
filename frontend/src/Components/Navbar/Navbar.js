// import React from 'react'
// import './Crop_Nav.css'
// import { Link } from 'react-router-dom'

// function Crop_Nav() {
//   return (
//     <div>
//       <ul className='C_home-ui'>
//         <li className='C_home_li'>
//             <Link to ="/mainHome" >
//             <h1>Home</h1>
//             </Link>
//         </li> 
//         <li className='C_home_li'>
//             <Link to = "/Crop_Records">
//             <h1>ADD Crop Records</h1>
//             </Link>
//         </li>
//         <li className='C_home_li'>
//             <Link to = "/View_R">
//             <h1>Crop Records</h1>
//             </Link>
//         </li>
//       </ul>
//     </div>
//   )
// }

// export default Crop_Nav
import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">Green Harvest</h1>
        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            {/* <a href="#CropRecord">Crop Record</a> */}
            <Link to="/Crop_Add">Crop Record</Link> {/* Use Link instead of a tag */}
          </li>
          <li>
            <a href="#Income">Income</a>
          </li>
          <li>
            <a href="#Expence">Expence</a>
          </li>
          <li>
            <Link to="/ask-ai">Ask AI</Link> {/* Use Link instead of a tag */}
          </li>

          <li>
            <a href="#about">About Us</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;