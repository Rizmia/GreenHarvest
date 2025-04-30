// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import "./Crop_Update.css"; 

// function Crop_Update() {
//   const [inputs, setInputs] = useState({
//     crop_name: "",
//     crop_quantity: "",
//     soil_type: "",
//     planting_date: "",
//     harvest_time: "",
//     Fertilizer_Type: "",
//     Fertilizer_quantity: "",
//     Water_Requirement: "",
//     Expected_Yield: "",
//     Weather_Conditions: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [showPopup, setShowPopup] = useState(false);

//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchHandler = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/CropR/${id}`);
//         const cropData = response.data.cropRecord;
//         if (cropData) {
//           const formattedData = {
//             ...cropData,
//             planting_date: new Date(cropData.planting_date).toISOString().split("T")[0],
//             harvest_time: new Date(cropData.harvest_time).toISOString().split("T")[0],
//           };
//           setInputs(formattedData);
//         }
//       } catch (error) {
//         console.error("Error fetching crop data:", error);
//       }
//     };
//     fetchHandler();
//   }, [id]);

//   const validateInputs = () => {
//     let newErrors = {};

//     Object.keys(inputs).forEach((key) => {
//       if (!inputs[key]) {
//         newErrors[key] = "Enter this detail or if you want to keep it empty, enter '-'";
//       }
//     });

//     if (inputs.crop_quantity < 0) {
//       newErrors.crop_quantity = "Negative values are not valid";
//     }
//     if (inputs.Fertilizer_quantity < 0) {
//       newErrors.Fertilizer_quantity = "Negative values are not valid";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     setInputs((prevState) => ({
//       ...prevState,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateInputs()) {
//       setShowPopup(true);
//     }
//   };

//   const confirmUpdate = async () => {
//     try {
//       await axios.put(`http://localhost:5000/CropR/${id}`, inputs);
//       setShowPopup(false);
//       alert("Successfully updated details!");
//       navigate("/Crop_History");
//     } catch (error) {
//       console.error("Error updating crop:", error);
//     }
//   };

//   return (
//     <div className="crop-update-container">
//       <button className="back-button" onClick={() => navigate("/Crop_History")}>
//         ← Back
//       </button>
//       <div className="update-form-container">
//         <h1>Update Crop Details</h1>
//         <form onSubmit={handleSubmit}>
//           {Object.keys(inputs).map((key) => (
//             <div key={key} className="input-group">
//               <label>{key.replace(/_/g, " ")}:</label>
//               <input
//                 type={key.includes("date") ? "date" : "text"}
//                 name={key}
//                 value={inputs[key]}
//                 onChange={handleChange}
//               />
//               {errors[key] && <span className="error-message">{errors[key]}</span>}
//             </div>
//           ))}
//           <button type="submit" className="update-button">Update Crop</button>
//         </form>
//       </div>

//       {/* Pop-up confirmation */}
//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup-box">
//             <h2>Update Crop Details</h2>
//             <p>Are you sure you want to update the crop details?</p>
//             <div className="popup-buttons">
//               <button onClick={confirmUpdate} className="popup-confirm">Update</button>
//               <button onClick={() => setShowPopup(false)} className="popup-close">Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Crop_Update;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Crop_Update.css";

function Crop_Update() {
  const [inputs, setInputs] = useState({
    crop_name: "",
    crop_quantity: "",
    soil_type: "",
    planting_date: "",
    harvest_time: "",
    Fertilizer_Type: "",
    Fertilizer_quantity: "",
    Water_Requirement: "",
    Expected_Yield: "",
    Weather_Conditions: "",
  });
  const [customFields, setCustomFields] = useState({});
  const [newCustomField, setNewCustomField] = useState({ name: "", value: "" });
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/CropR/${id}`);
        const cropData = response.data.cropRecord;
        if (cropData) {
          const formattedData = {
            ...cropData,
            planting_date: new Date(cropData.planting_date).toISOString().split("T")[0],
            harvest_time: new Date(cropData.harvest_time).toISOString().split("T")[0],
          };
          setInputs(formattedData);
          setCustomFields(cropData.customFields || {});
        }
      } catch (error) {
        console.error("Error fetching crop data:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const validateInputs = () => {
    let newErrors = {};
    Object.keys(inputs).forEach((key) => {
      if (!inputs[key]) {
        newErrors[key] = "Enter this detail or if you want to keep it empty, enter '-'";
      }
    });
    if (inputs.crop_quantity < 0) {
      newErrors.crop_quantity = "Negative values are not valid";
    }
    if (inputs.Fertilizer_quantity < 0) {
      newErrors.Fertilizer_quantity = "Negative values are not valid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCustomFieldChange = (key, value) => {
    setCustomFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleNewCustomFieldChange = (e) => {
    setNewCustomField((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addNewCustomField = () => {
    if (newCustomField.name && newCustomField.value) {
      setCustomFields((prev) => ({ ...prev, [newCustomField.name]: newCustomField.value }));
      setNewCustomField({ name: "", value: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      setShowPopup(true);
    }
  };

  const confirmUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/CropR/${id}`, { ...inputs, customFields });
      setShowPopup(false); // Fixed typo here
      alert("Successfully updated details!");
      navigate("/Crop_History");
    } catch (error) {
      console.error("Error updating crop:", error);
    }
  };

  return (
    <div className="crop-update-container">
      <button className="back-button" onClick={() => navigate("/Crop_History")}>
        ← Back
      </button>
      <div className="update-form-container">
        <h1>Update Crop Details</h1>
        <form onSubmit={handleSubmit}>
          {Object.keys(inputs).map((key) => (
            <div key={key} className="input-group">
              <label>{key.replace(/_/g, " ")}:</label>
              <input
                type={key.includes("date") ? "date" : "text"}
                name={key}
                value={inputs[key]}
                onChange={handleChange}
              />
              {errors[key] && <span className="error-message">{errors[key]}</span>}
            </div>
          ))}

          {/* Existing Custom Fields */}
          {Object.entries(customFields).map(([key, value]) => (
            <div key={key} className="input-group">
              <label>{key.replace(/_/g, " ")}:</label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleCustomFieldChange(key, e.target.value)}
              />
            </div>
          ))}

          {/* Add New Custom Field
          <div className="input-group">
            <label>New Custom Field Name:</label>
            <input
              type="text"
              name="name"
              value={newCustomField.name}
              onChange={handleNewCustomFieldChange}
            /> */}
            {/* <label>Value:</label>
            <input
              type="text"
              name="value"
              value={newCustomField.value}
              onChange={handleNewCustomFieldChange}
            /> */}
            {/* <button type="button" onClick={addNewCustomField} className="add-custom-btn">
              Add Field
            </button> */}
          {/* </div> */}

          <button type="submit" className="update-button">Update Crop</button>
        </form>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Update Crop Details</h2>
            <p>Are you sure you want to update the crop details?</p>
            <div className="popup-buttons">
              <button onClick={confirmUpdate} className="popup-confirm">Update</button>
              <button onClick={() => setShowPopup(false)} className="popup-close">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Crop_Update;