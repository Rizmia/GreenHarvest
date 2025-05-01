// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Home.css';

// function Home() {
//   return (
//     <div className="home-container">
//       {/* Semi-transparent overlay for readability */}
//       <div className="home-overlay"></div>

//       {/* Main content */}
//       <div className="home-content">
//         <h1 className="home-title">Welcome to Crop Records</h1>
//         <p className="home-intro">
//           Manage your agricultural data with ease. Track crop history, update details, and plan your farming activities efficiently.
//         </p>

//         {/* Features Section */}
//         <div className="home-features">
//           <h2>Key Features</h2>
//           <ul>
//             <li>Add new crop details to keep your records up-to-date.</li>
//             <li>View and manage your crop history in one place.</li>
//             <li>Update existing crop records with ease.</li>
//             <li>Monitor planting dates, harvest times, and more.</li>
//           </ul>
//         </div>

//         {/* Call to Action Buttons */}
//         <div className="home-buttons">
//           <Link to="/Crop_History">
//             <button className="home-btn history-btn">View Crop History</button>
//           </Link>
//           <Link to="/Crop_Add">
//             <button className="home-btn add-btn">Add Crop Details</button>
//           </Link>
//           <Link to="/Crop_Expenses">
//             <button className="home-btn expenses-btn">Crop Expenses</button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Login');
  };

  return (
    <div className="home-container">
      <div className="home-overlay"></div>
      <div className="home-content">
        <h1 className="home-title">Welcome to Crop Records</h1>
        <p className="home-intro">
          Manage your agricultural data with ease. Track crop history, update details, and plan your farming activities efficiently.
        </p>
        <div className="home-features">
          <h2>Key Features</h2>
          <ul>
            <li>Add new crop details to keep your records up-to-date.</li>
            <li>View and manage your crop history in one place.</li>
            <li>Update existing crop records with ease.</li>
            <li>Monitor planting dates, harvest times, and more.</li>
          </ul>
        </div>
        <div className="home-buttons">
          <Link to="/Crop_History">
            <button className="home-btn history-btn">View Crop History</button>
          </Link>
          <Link to="/Crop_Add">
            <button className="home-btn add-btn">Add Crop Details</button>
          </Link>
          <Link to="/Crop_Expenses">
            <button className="home-btn expenses-btn">Crop Expenses</button>
          </Link>
          <button className="home-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

