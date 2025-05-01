// // import React, { useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import axios from "axios";
// // import './Crop_Add.css';

// // function Crop_Add() {
// //   const navigate = useNavigate();
// //   const [inputs, setInputs] = useState({
// //     crop_name: "",
// //     crop_quantity: "",
// //     soil_type: "",
// //     planting_date: "",
// //     harvest_time: "",
// //     Fertilizer_Type: "",
// //     Fertilizer_quantity: "",
// //     Water_Requirement: "",
// //     Expected_Yield: "",
// //     Weather_Conditions: "",
// //   });
// //   const [errors, setErrors] = useState({});
// //   const [showPopup, setShowPopup] = useState(false);
// //   const [successMessage, setSuccessMessage] = useState("");

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setInputs((prevState) => ({
// //       ...prevState,
// //       [name]: value,
// //     }));
// //     // Clear error for the field when user starts typing
// //     setErrors((prevErrors) => ({
// //       ...prevErrors,
// //       [name]: "",
// //     }));
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};
    
// //     // Check for empty fields
// //     Object.keys(inputs).forEach((key) => {
// //       if (!inputs[key].trim()) {
// //         newErrors[key] = "Enter this Details or if you want keep it as empty enter '-'";
// //       } else if (inputs[key].trim() === "-") {
// //         newErrors[key] = ""; // No error if user enters "-"
// //       }
// //     });

// //     // Additional validation for negative values
// //     if (inputs.crop_quantity && Number(inputs.crop_quantity) < 0) {
// //       newErrors.crop_quantity = "Negative values are not valid";
// //     }
    
// //     if (inputs.Fertilizer_quantity && Number(inputs.Fertilizer_quantity) < 0) {
// //       newErrors.Fertilizer_quantity = "Negative values are not valid";
// //     }

// //     setErrors(newErrors);
// //     return Object.values(newErrors).every((error) => error === "");
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (validateForm()) {
// //       setShowPopup(true);
// //     }
// //   };

// //   const confirmAdd = async () => {
// //     try {
// //       await sendRequest();
// //       setShowPopup(false);
// //       setSuccessMessage("Successfully added new details");
// //       setTimeout(() => {
// //         navigate("/Crop_History");
// //       }, 2000);
// //     } catch (error) {
// //       console.error("Error adding crop:", error);
// //       setShowPopup(false);
// //     }
// //   };

// //   const cancelAdd = () => {
// //     setShowPopup(false);
// //     navigate("/Crop_Add");
// //   };

// //   const sendRequest = async () => {
// //     await axios.post("http://localhost:5000/CropR", {
// //       crop_name: inputs.crop_name.trim() === "-" ? "" : String(inputs.crop_name),
// //       crop_quantity: inputs.crop_quantity.trim() === "-" ? 0 : Number(inputs.crop_quantity),
// //       soil_type: inputs.soil_type.trim() === "-" ? "" : String(inputs.soil_type),
// //       planting_date: inputs.planting_date.trim() === "-" ? "" : inputs.planting_date,
// //       harvest_time: inputs.harvest_time.trim() === "-" ? "" : inputs.harvest_time,
// //       Fertilizer_Type: inputs.Fertilizer_Type.trim() === "-" ? "" : String(inputs.Fertilizer_Type),
// //       Fertilizer_quantity: inputs.Fertilizer_quantity.trim() === "-" ? 0 : Number(inputs.Fertilizer_quantity),
// //       Water_Requirement: inputs.Water_Requirement.trim() === "-" ? "" : String(inputs.Water_Requirement),
// //       Expected_Yield: inputs.Expected_Yield.trim() === "-" ? "" : String(inputs.Expected_Yield),
// //       Weather_Conditions: inputs.Weather_Conditions.trim() === "-" ? "" : String(inputs.Weather_Conditions),
// //     }).then((res) => res.data);
// //   };

// //   return (
// //     <div className="crop-add-page">
// //       <Link to="/Crop_History" className="crop-add-back-btn">
// //         <button>Back</button>
// //       </Link>
// //       <h1 className="crop-add-title">ADD CROP DETAILS</h1>
// //       <div className="crop-add-form-container">
// //         <form onSubmit={handleSubmit} className="crop-add-form">
// //           <div className="crop-add-form-group">
// //             <label>Crop Name:</label>
// //             <input
// //               type="text"
// //               name="crop_name"
// //               value={inputs.crop_name}
// //               onChange={handleChange}
// //             />
// //             {errors.crop_name && <span className="crop-add-error">{errors.crop_name}</span>}
// //           </div>

// //           <div className="crop-add-form-group">
// //             <label>Crop Quantity :</label>
// //             <input
// //               type="number"
// //               name="crop_quantity"
// //               value={inputs.crop_quantity}
// //               onChange={handleChange}
// //             />
// //             {errors.crop_quantity && <span className="crop-add-error">{errors.crop_quantity}</span>}
// //           </div>

// //           <div className="crop-add-form-group">
// //             <label>Soil Type:</label>
// //             <input
// //               type="text"
// //               name="soil_type"
// //               value={inputs.soil_type}
// //               onChange={handleChange}
// //             />
// //             {errors.soil_type && <span className="crop-add-error">{errors.soil_type}</span>}
// //           </div>

// //           <div className="crop-add-form-group">
// //             <label>Planting Date:</label>
// //             <input
// //               type="date"
// //               name="planting_date"
// //               value={inputs.planting_date}
// //               onChange={handleChange}
// //             />
// //             {errors.planting_date && <span className="crop-add-error">{errors.planting_date}</span>}
// //           </div>

// //           <div className="crop-add-form-group">
// //             <label>Harvest Time:</label>
// //             <input
// //               type="date"
// //               name="harvest_time"
// //               value={inputs.harvest_time}
// //               onChange={handleChange}
// //             />
// //             {errors.harvest_time && <span className="crop-add-error">{errors.harvest_time}</span>}
// //           </div>

// //           <div className="crop-add-form-group">
// //             <label>Fertilizer Type:</label>
// //             <input
// //               type="text"
// //               name="Fertilizer_Type"
// //               value={inputs.Fertilizer_Type}
// //               onChange={handleChange}
// //             />
// //             {errors.Fertilizer_Type && <span className="crop-add-error">{errors.Fertilizer_Type}</span>}
// //           </div>

// //           <div className="crop-add-form-group">
// //             <label>Fertilizer Quantity:</label>
// //             <input
// //               type="number"
// //               name="Fertilizer_quantity"
// //               value={inputs.Fertilizer_quantity}
// //               onChange={handleChange}
// //             />
// //             {errors.Fertilizer_quantity && <span className="crop-add-error">{errors.Fertilizer_quantity}</span>}
// //           </div>

// //           <div className="crop-add-form-group">
// //             <label>Water Requirement:</label>
// //             <input
// //               type="text"
// //               name="Water_Requirement"
// //               value={inputs.Water_Requirement}
// //               onChange={handleChange}
// //             />
// //             {errors.Water_Requirement && <span className="crop-add-error">{errors.Water_Requirement}</span>}
// //           </div>

// //           <div className="crop-add-form-group">
// //             <label>Expected Yield:</label>
// //             <input
// //               type="text"
// //               name="Expected_Yield"
// //               value={inputs.Expected_Yield}
// //               onChange={handleChange}
// //             />
// //             {errors.Expected_Yield && <span className="crop-add-error">{errors.Expected_Yield}</span>}
// //           </div>

// //           <div className="crop-add-form-group">
// //             <label>Weather Conditions:</label>
// //             <input
// //               type="text"
// //               name="Weather_Conditions"
// //               value={inputs.Weather_Conditions}
// //               onChange={handleChange}
// //             />
// //             {errors.Weather_Conditions && <span className="crop-add-error">{errors.Weather_Conditions}</span>}
// //           </div>

// //           <button type="submit" className="crop-add-submit-btn">Add Crop</button>
// //         </form>
// //       </div>

// //       {showPopup && (
// //         <div className="crop-add-popup-overlay">
// //           <div className="crop-add-popup">
// //             <h2>Add New Crop Details</h2>
// //             <div className="crop-add-popup-buttons">
// //               <button onClick={confirmAdd} className="crop-add-confirm-btn">ADD</button>
// //               <button onClick={cancelAdd} className="crop-add-cancel-btn">Close</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {successMessage && (
// //         <div className="crop-add-success-message">
// //           <p>{successMessage}</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default Crop_Add;

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import './Crop_Add.css';

// function Crop_Add() {
//   const navigate = useNavigate();
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
//   const [customFields, setCustomFields] = useState([]); // For dynamic fields
//   const [errors, setErrors] = useState({});
//   const [showPopup, setShowPopup] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setInputs((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: "",
//     }));
//   };

//   const handleCustomFieldChange = (index, field, value) => {
//     const updatedFields = [...customFields];
//     updatedFields[index][field] = value;
//     setCustomFields(updatedFields);
//   };

//   const addCustomField = () => {
//     setCustomFields([...customFields, { name: "", value: "" }]);
//   };

//   const removeCustomField = (index) => {
//     setCustomFields(customFields.filter((_, i) => i !== index));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     Object.keys(inputs).forEach((key) => {
//       if (!inputs[key].trim()) {
//         newErrors[key] = "Enter this Details or if you want keep it as empty enter '-'";
//       } else if (inputs[key].trim() === "-") {
//         newErrors[key] = "";
//       }
//     });

//     if (inputs.crop_quantity && Number(inputs.crop_quantity) < 0) {
//       newErrors.crop_quantity = "Negative values are not valid";
//     }
//     if (inputs.Fertilizer_quantity && Number(inputs.Fertilizer_quantity) < 0) {
//       newErrors.Fertilizer_quantity = "Negative values are not valid";
//     }

//     customFields.forEach((field, index) => {
//       if (!field.name.trim()) {
//         newErrors[`custom_name_${index}`] = "Field name is required";
//       }
//       if (!field.value.trim()) {
//         newErrors[`custom_value_${index}`] = "Enter value or '-'";
//       } else if (field.value.trim() === "-") {
//         newErrors[`custom_value_${index}`] = "";
//       }
//     });

//     setErrors(newErrors);
//     return Object.values(newErrors).every((error) => error === "");
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setShowPopup(true);
//     }
//   };

//   const confirmAdd = async () => {
//     try {
//       await sendRequest();
//       setShowPopup(false);
//       setSuccessMessage("Successfully added new details");
//       setTimeout(() => {
//         navigate("/Crop_History");
//       }, 2000);
//     } catch (error) {
//       console.error("Error adding crop:", error);
//       setShowPopup(false);
//     }
//   };

//   const cancelAdd = () => {
//     setShowPopup(false);
//   };

//   const sendRequest = async () => {
//     const payload = {
//       crop_name: inputs.crop_name.trim() === "-" ? "" : String(inputs.crop_name),
//       crop_quantity: inputs.crop_quantity.trim() === "-" ? 0 : Number(inputs.crop_quantity),
//       soil_type: inputs.soil_type.trim() === "-" ? "" : String(inputs.soil_type),
//       planting_date: inputs.planting_date.trim() === "-" ? "" : inputs.planting_date,
//       harvest_time: inputs.harvest_time.trim() === "-" ? "" : inputs.harvest_time,
//       Fertilizer_Type: inputs.Fertilizer_Type.trim() === "-" ? "" : String(inputs.Fertilizer_Type),
//       Fertilizer_quantity: inputs.Fertilizer_quantity.trim() === "-" ? 0 : Number(inputs.Fertilizer_quantity),
//       Water_Requirement: inputs.Water_Requirement.trim() === "-" ? "" : String(inputs.Water_Requirement),
//       Expected_Yield: inputs.Expected_Yield.trim() === "-" ? "" : String(inputs.Expected_Yield),
//       Weather_Conditions: inputs.Weather_Conditions.trim() === "-" ? "" : String(inputs.Weather_Conditions),
//       customFields: customFields.reduce((acc, field) => {
//         acc[field.name] = field.value.trim() === "-" ? "" : field.value;
//         return acc;
//       }, {}),
//     };
//     await axios.post("http://localhost:5000/CropR", payload).then((res) => res.data);
//   };

//   return (
//     <div className="crop-add-page">
//       <Link to="/Crop_History" className="crop-add-back-btn">
//         <button>Back</button>
//       </Link>
//       <h1 className="crop-add-title">ADD CROP DETAILS</h1>
//       <div className="crop-add-form-container">
//         <form onSubmit={handleSubmit} className="crop-add-form">
//           {/* Default Fields */}
//           <div className="crop-add-form-group">
//             <label>Crop Name:</label>
//             <input type="text" name="crop_name" value={inputs.crop_name} onChange={handleChange} />
//             {errors.crop_name && <span className="crop-add-error">{errors.crop_name}</span>}
//           </div>
//           <div className="crop-add-form-group">
//             <label>Crop Quantity:</label>
//             <input type="number" name="crop_quantity" value={inputs.crop_quantity} onChange={handleChange} />
//             {errors.crop_quantity && <span className="crop-add-error">{errors.crop_quantity}</span>}
//           </div>
//           <div className="crop-add-form-group">
//             <label>Soil Type:</label>
//             <input type="text" name="soil_type" value={inputs.soil_type} onChange={handleChange} />
//             {errors.soil_type && <span className="crop-add-error">{errors.soil_type}</span>}
//           </div>
//           <div className="crop-add-form-group">
//             <label>Planting Date:</label>
//             <input type="date" name="planting_date" value={inputs.planting_date} onChange={handleChange} />
//             {errors.planting_date && <span className="crop-add-error">{errors.planting_date}</span>}
//           </div>
//           <div className="crop-add-form-group">
//             <label>Harvest Time:</label>
//             <input type="date" name="harvest_time" value={inputs.harvest_time} onChange={handleChange} />
//             {errors.harvest_time && <span className="crop-add-error">{errors.harvest_time}</span>}
//           </div>
//           <div className="crop-add-form-group">
//             <label>Fertilizer Type:</label>
//             <input type="text" name="Fertilizer_Type" value={inputs.Fertilizer_Type} onChange={handleChange} />
//             {errors.Fertilizer_Type && <span className="crop-add-error">{errors.Fertilizer_Type}</span>}
//           </div>
//           <div className="crop-add-form-group">
//             <label>Fertilizer Quantity:</label>
//             <input type="number" name="Fertilizer_quantity" value={inputs.Fertilizer_quantity} onChange={handleChange} />
//             {errors.Fertilizer_quantity && <span className="crop-add-error">{errors.Fertilizer_quantity}</span>}
//           </div>
//           <div className="crop-add-form-group">
//             <label>Water Requirement:</label>
//             <input type="text" name="Water_Requirement" value={inputs.Water_Requirement} onChange={handleChange} />
//             {errors.Water_Requirement && <span className="crop-add-error">{errors.Water_Requirement}</span>}
//           </div>
//           <div className="crop-add-form-group">
//             <label>Expected Yield:</label>
//             <input type="text" name="Expected_Yield" value={inputs.Expected_Yield} onChange={handleChange} />
//             {errors.Expected_Yield && <span className="crop-add-error">{errors.Expected_Yield}</span>}
//           </div>
//           <div className="crop-add-form-group">
//             <label>Weather Conditions:</label>
//             <input type="text" name="Weather_Conditions" value={inputs.Weather_Conditions} onChange={handleChange} />
//             {errors.Weather_Conditions && <span className="crop-add-error">{errors.Weather_Conditions}</span>}
//           </div>

//           {/* Custom Fields */}
//           {customFields.map((field, index) => (
//             <div key={index} className="crop-add-custom-field-group">
//               <div className="crop-add-form-group">
//                 <label>Custom Field Name:</label>
//                 <input
//                   type="text"
//                   value={field.name}
//                   onChange={(e) => handleCustomFieldChange(index, "name", e.target.value)}
//                 />
//                 {errors[`custom_name_${index}`] && (
//                   <span className="crop-add-error">{errors[`custom_name_${index}`]}</span>
//                 )}
//               </div>
//               <div className="crop-add-form-group">
//                 <label>Value:</label>
//                 <input
//                   type="text"
//                   value={field.value}
//                   onChange={(e) => handleCustomFieldChange(index, "value", e.target.value)}
//                 />
//                 {errors[`custom_value_${index}`] && (
//                   <span className="crop-add-error">{errors[`custom_value_${index}`]}</span>
//                 )}
//               </div>
//               <button type="button" className="crop-add-remove-btn" onClick={() => removeCustomField(index)}>
//                 Remove
//               </button>
//             </div>
//           ))}

//           <button type="button" className="crop-add-custom-btn" onClick={addCustomField}>
//             Add Custom Field
//           </button>
//           <button type="submit" className="crop-add-submit-btn">Add Crop</button>
//         </form>
//       </div>

//       {showPopup && (
//         <div className="crop-add-popup-overlay">
//           <div className="crop-add-popup">
//             <h2>Add New Crop Details</h2>
//             <div className="crop-add-popup-buttons">
//               <button onClick={confirmAdd} className="crop-add-confirm-btn">ADD</button>
//               <button onClick={cancelAdd} className="crop-add-cancel-btn">Close</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {successMessage && (
//         <div className="crop-add-success-message">
//           <p>{successMessage}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Crop_Add;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Crop_Add.css';

function Crop_Add() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    crop_name: '',
    crop_quantity: '',
    soil_type: '',
    planting_date: '',
    harvest_time: '',
    Fertilizer_Type: '',
    Fertilizer_quantity: '',
    Water_Requirement: '',
    Expected_Yield: '',
    Weather_Conditions: '',
  });
  const [customFields, setCustomFields] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleCustomFieldChange = (index, field, value) => {
    const updatedFields = [...customFields];
    updatedFields[index][field] = value;
    setCustomFields(updatedFields);
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { name: '', value: '' }]);
  };

  const removeCustomField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(inputs).forEach((key) => {
      if (!inputs[key].trim()) {
        newErrors[key] = "Enter this Details or if you want keep it as empty enter '-'";
      } else if (inputs[key].trim() === '-') {
        newErrors[key] = '';
      }
    });

    if (inputs.crop_quantity && Number(inputs.crop_quantity) < 0) {
      newErrors.crop_quantity = 'Negative values are not valid';
    }
    if (inputs.Fertilizer_quantity && Number(inputs.Fertilizer_quantity) < 0) {
      newErrors.Fertilizer_quantity = 'Negative values are not valid';
    }

    customFields.forEach((field, index) => {
      if (!field.name.trim()) {
        newErrors[`custom_name_${index}`] = 'Field name is required';
      }
      if (!field.value.trim()) {
        newErrors[`custom_value_${index}`] = "Enter value or '-'";
      } else if (field.value.trim() === '-') {
        newErrors[`custom_value_${index}`] = '';
      }
    });

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPopup(true);
    }
  };

  const confirmAdd = async () => {
    try {
      await sendRequest();
      setShowPopup(false);
      setSuccessMessage('Successfully added new details');
      setTimeout(() => {
        navigate('/Crop_History');
      }, 2000);
    } catch (error) {
      console.error('Error adding crop:', error);
      setShowPopup(false);
      setSuccessMessage('Error adding crop. Please try again.');
    }
  };

  const cancelAdd = () => {
    setShowPopup(false);
  };

  const sendRequest = async () => {
    const token = localStorage.getItem('token');
    const payload = {
      crop_name: inputs.crop_name.trim() === '-' ? '' : String(inputs.crop_name),
      crop_quantity: inputs.crop_quantity.trim() === '-' ? 0 : Number(inputs.crop_quantity),
      soil_type: inputs.soil_type.trim() === '-' ? '' : String(inputs.soil_type),
      planting_date: inputs.planting_date.trim() === '-' ? '' : inputs.planting_date,
      harvest_time: inputs.harvest_time.trim() === '-' ? '' : inputs.harvest_time,
      Fertilizer_Type: inputs.Fertilizer_Type.trim() === '-' ? '' : String(inputs.Fertilizer_Type),
      Fertilizer_quantity: inputs.Fertilizer_quantity.trim() === '-' ? 0 : Number(inputs.Fertilizer_quantity),
      Water_Requirement: inputs.Water_Requirement.trim() === '-' ? '' : String(inputs.Water_Requirement),
      Expected_Yield: inputs.Expected_Yield.trim() === '-' ? '' : String(inputs.Expected_Yield),
      Weather_Conditions: inputs.Weather_Conditions.trim() === '-' ? '' : String(inputs.Weather_Conditions),
      customFields: customFields.reduce((acc, field) => {
        acc[field.name] = field.value.trim() === '-' ? '' : field.value;
        return acc;
      }, {}),
    };
    await axios.post('http://localhost:5000/CropR', payload, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.data);
  };

  return (
    <div className="crop-add-page">
      <Link to="/Crop_History" className="crop-add-back-btn">
        <button>Back</button>
      </Link>
      <h1 className="crop-add-title">ADD CROP DETAILS</h1>
      <div className="crop-add-form-container">
        <form onSubmit={handleSubmit} className="crop-add-form">
          <div className="crop-add-form-group">
            <label>Crop Name:</label>
            <input type="text" name="crop_name" value={inputs.crop_name} onChange={handleChange} />
            {errors.crop_name && <span className="crop-add-error">{errors.crop_name}</span>}
          </div>
          <div className="crop-add-form-group">
            <label>Crop Quantity:</label>
            <input type="number" name="crop_quantity" value={inputs.crop_quantity} onChange={handleChange} />
            {errors.crop_quantity && <span className="crop-add-error">{errors.crop_quantity}</span>}
          </div>
          <div className="crop-add-form-group">
            <label>Soil Type:</label>
            <input type="text" name="soil_type" value={inputs.soil_type} onChange={handleChange} />
            {errors.soil_type && <span className="crop-add-error">{errors.soil_type}</span>}
          </div>
          <div className="crop-add-form-group">
            <label>Planting Date:</label>
            <input type="date" name="planting_date" value={inputs.planting_date} onChange={handleChange} />
            {errors.planting_date && <span className="crop-add-error">{errors.planting_date}</span>}
          </div>
          <div className="crop-add-form-group">
            <label>Harvest Time:</label>
            <input type="date" name="harvest_time" value={inputs.harvest_time} onChange={handleChange} />
            {errors.harvest_time && <span className="crop-add-error">{errors.harvest_time}</span>}
          </div>
          <div className="crop-add-form-group">
            <label>Fertilizer Type:</label>
            <input type="text" name="Fertilizer_Type" value={inputs.Fertilizer_Type} onChange={handleChange} />
            {errors.Fertilizer_Type && <span className="crop-add-error">{errors.Fertilizer_Type}</span>}
          </div>
          <div className="crop-add-form-group">
            <label>Fertilizer Quantity:</label>
            <input type="number" name="Fertilizer_quantity" value={inputs.Fertilizer_quantity} onChange={handleChange} />
            {errors.Fertilizer_quantity && <span className="crop-add-error">{errors.Fertilizer_quantity}</span>}
          </div>
          <div className="crop-add-form-group">
            <label>Water Requirement:</label>
            <input type="text" name="Water_Requirement" value={inputs.Water_Requirement} onChange={handleChange} />
            {errors.Water_Requirement && <span className="crop-add-error">{errors.Water_Requirement}</span>}
          </div>
          <div className="crop-add-form-group">
            <label>Expected Yield:</label>
            <input type="text" name="Expected_Yield" value={inputs.Expected_Yield} onChange={handleChange} />
            {errors.Expected_Yield && <span className="crop-add-error">{errors.Expected_Yield}</span>}
          </div>
          <div className="crop-add-form-group">
            <label>Weather Conditions:</label>
            <input type="text" name="Weather_Conditions" value={inputs.Weather_Conditions} onChange={handleChange} />
            {errors.Weather_Conditions && <span className="crop-add-error">{errors.Weather_Conditions}</span>}
          </div>

          {customFields.map((field, index) => (
            <div key={index} className="crop-add-custom-field-group">
              <div className="crop-add-form-group">
                <label>Custom Field Name:</label>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
                />
                {errors[`custom_name_${index}`] && (
                  <span className="crop-add-error">{errors[`custom_name_${index}`]}</span>
                )}
              </div>
              <div className="crop-add-form-group">
                <label>Value:</label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                />
                {errors[`custom_value_${index}`] && (
                  <span className="crop-add-error">{errors[`custom_value_${index}`]}</span>
                )}
              </div>
              <button type="button" className="crop-add-remove-btn" onClick={() => removeCustomField(index)}>
                Remove
              </button>
            </div>
          ))}

          <button type="button" className="crop-add-custom-btn" onClick={addCustomField}>
            Add Custom Field
          </button>
          <button type="submit" className="crop-add-submit-btn">Add Crop</button>
        </form>
      </div>

      {showPopup && (
        <div className="crop-add-popup-overlay">
          <div className="crop-add-popup">
            <h2>Add New Crop Details</h2>
            <div className="crop-add-popup-buttons">
              <button onClick={confirmAdd} className="crop-add-confirm-btn">ADD</button>
              <button onClick={cancelAdd} className="crop-add-cancel-btn">Close</button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="crop-add-success-message">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Crop_Add;
