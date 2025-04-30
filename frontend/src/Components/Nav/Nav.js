import React from 'react';
import './nav.css';
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav>
      <ul className="localincome-home-ul">
        <li className="localincome-home-ll">
          <Link to="/mainincomehome" className="incomeactive home-a">Income Calculating Home Page</Link>
        </li>
        <li className="localincome-home-ll">
          <Link to="/localincomedetails" className="incomeactive home-a">Local Income Details</Link>
        </li>
        <li className="localincome-home-ll">
          <Link to="/addlocalincome" className="incomeactive home-a">Add Income Details</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
