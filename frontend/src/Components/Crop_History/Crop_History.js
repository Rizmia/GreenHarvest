// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import Crops from '../Crops/Crops';
// import './Crop_History.css';

// const URL = 'http://localhost:5000/CropR';

// const fetchHandler = async () => {
//   try {
//     const res = await axios.get(URL);
//     return res.data;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return { crops: [] };
//   }
// };

// function Crop_History() {
//   const [crops, setCrops] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch crops on mount
//   useEffect(() => {
//     setLoading(true);
//     fetchHandler()
//       .then((data) => setCrops(data.crops || []))
//       .finally(() => setLoading(false));
//   }, []);

//   // Handle deletion by updating state
//   const handleDelete = (id) => {
//     setCrops((prevCrops) => prevCrops.filter((crop) => crop._id !== id));
//   };

//   return (
//     <div className="crop-history-container">
//       <Link to="/" className="back-btn">
//         <button>Back</button>
//       </Link>
//       <h1>Crop History</h1>
//       <Link to="/Crop_Add" className="add-btn">
//         <button>ADD CROP DETAILS</button>
//       </Link>
//       {loading ? (
//         <p className="loading">Loading crops...</p>
//       ) : crops.length > 0 ? (
//         <table className="crop-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Crop Name</th>
//               <th>Crop Quantity</th>
//               <th>Soil Type</th>
//               <th>Planting Date</th>
//               <th>Harvest Time</th>
//               <th>Fertilizer Type</th>
//               <th>Fertilizer Quantity</th>
//               <th>Water Requirement</th>
//               <th>Expected Yield</th>
//               <th>Weather Conditions</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {crops.map((crop) => (
//               <Crops key={crop._id} user={crop} onDelete={handleDelete} />
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p className="no-records">No crop records found.</p>
//       )}
//     </div>
//   );
// }

// export default Crop_History;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Crops from '../Crops/Crops';
import './Crop_History.css';

const URL = 'http://localhost:5000/CropR';

const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return { crops: [] };
  }
};

function Crop_History() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchHandler()
      .then((data) => setCrops(data.crops || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    setCrops((prevCrops) => prevCrops.filter((crop) => crop._id !== id));
  };

  // Get all possible custom field names across all crops
  const allCustomFields = Array.from(
    new Set(crops.flatMap(crop => Object.keys(crop.customFields || {})))
  );

  return (
    <div className="crop-history-container">
      <Link to="/" className="back-btn">
        <button>Back</button>
      </Link>
      <h1>Crop History</h1>
      <Link to="/Crop_Add" className="add-btn">
        <button>ADD CROP DETAILS</button>
      </Link>
      {loading ? (
        <p className="loading">Loading crops...</p>
      ) : crops.length > 0 ? (
        <table className="crop-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Crop Name</th>
              <th>Crop Quantity</th>
              <th>Soil Type</th>
              <th>Planting Date</th>
              <th>Harvest Time</th>
              <th>Fertilizer Type</th>
              <th>Fertilizer Quantity</th>
              <th>Water Requirement</th>
              <th>Expected Yield</th>
              <th>Weather Conditions</th>
              {allCustomFields.map((field) => (
                <th key={field}>{field.replace(/_/g, " ")}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((crop) => (
              <Crops key={crop._id} user={crop} onDelete={handleDelete} customFields={allCustomFields} />
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-records">No crop records found.</p>
      )}
    </div>
  );
}

export default Crop_History;