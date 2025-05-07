import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Crop_Add.css';
import Navbar from '../Navbar/Navbar';

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
  const [missingFields, setMissingFields] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const soilTypes = [
    'Alluvial Soil', 'Black Soil', 'Red Soil', 'Laterite Soil', 'Desert Soil',
    'Mountain Soil', 'Peat Soil', 'Chalky Soil', 'Loamy Soil', 'Sandy Soil',
    'Clay Soil', 'Silt Soil'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear existing error for the field being changed
    let newErrors = { ...errors, [name]: '' };

    // Immediate validation
    // Crop name validation
    if (name === 'crop_name' && value.length > 0 && value.length < 2) {
      newErrors.crop_name = 'Crop name must be at least 2 characters';
    }

    // Crop quantity validation
    if (name === 'crop_quantity' && value) {
      const num = Number(value);
      if (num <= 0) {
        newErrors.crop_quantity = 'Crop quantity must be greater than 0';
      }
    }

    // Fertilizer Type and Quantity validation
    if (name === 'Fertilizer_Type' || name === 'Fertilizer_quantity') {
      const fertilizerType = name === 'Fertilizer_Type' ? value : inputs.Fertilizer_Type;
      const fertilizerQuantity = name === 'Fertilizer_quantity' ? value : inputs.Fertilizer_quantity;
      const quantityNum = Number(fertilizerQuantity);

      if (!fertilizerType.trim() && quantityNum !== 0) {
        newErrors.Fertilizer_quantity = 'Fertilizer quantity must be 0 if Fertilizer Type is empty';
      } else if (fertilizerType.trim() && quantityNum <= 0) {
        newErrors.Fertilizer_quantity = 'Fertilizer quantity must be greater than 0 if Fertilizer Type is provided';
      }
    }

    // Water Requirement length validation
    if (name === 'Water_Requirement' && value.length > 100) {
      newErrors.Water_Requirement = 'Water Requirement cannot exceed 100 characters';
    }

    // Expected Yield format validation
    if (name === 'Expected_Yield' && value && !/^\d+(\.\d{1,2})?$/.test(value)) {
      newErrors.Expected_Yield = 'Expected Yield must be a valid number (e.g., 100 or 100.50)';
    }

    // Real-time date validation
    if (name === 'planting_date' || name === 'harvest_time') {
      const plantingDate = new Date(inputs.planting_date);
      const harvestDate = new Date(value);
      if (inputs.planting_date && value && harvestDate <= plantingDate) {
        newErrors.harvest_time = 'Harvest date must be after planting date';
      }
    }

    setErrors(newErrors);
  };

  const handleSoilTypeChange = (e) => {
    const { value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      soil_type: value,
    }));
    // Clear error when soil type is changed
    setErrors((prevErrors) => ({ ...prevErrors, soil_type: '' }));
  };

  const handleCustomFieldChange = (index, field, value) => {
    const updatedFields = [...customFields];
    updatedFields[index][field] = value;
    setCustomFields(updatedFields);
    // Clear errors for the specific custom field
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`custom_name_${index}`];
      delete newErrors[`custom_value_${index}`];
      return newErrors;
    });
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { name: '', value: '' }]);
  };

  const removeCustomField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
    // Clear errors for the removed field
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`custom_name_${index}`];
      delete newErrors[`custom_value_${index}`];
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const missing = [];

    // Check for empty fields (except crop_name, which is required)
    Object.keys(inputs).forEach((key) => {
      if (key !== 'crop_name' && !inputs[key].trim() && inputs[key] !== '0') {
        missing.push(key.replace(/_/g, ' '));
      }
    });

    // Specific validations
    if (!inputs.crop_name) {
      newErrors.crop_name = 'Crop name is required';
    } else if (inputs.crop_name.length < 2) {
      newErrors.crop_name = 'Crop name must be at least 2 characters';
    }

    if (inputs.crop_quantity && Number(inputs.crop_quantity) <= 0) {
      newErrors.crop_quantity = 'Crop quantity must be greater than 0';
    }

    // Fertilizer Type and Quantity validation
    const fertilizerType = inputs.Fertilizer_Type;
    const fertilizerQuantity = Number(inputs.Fertilizer_quantity);
    if (!fertilizerType.trim() && fertilizerQuantity !== 0) {
      newErrors.Fertilizer_quantity = 'Fertilizer quantity must be 0 if Fertilizer Type is empty';
    } else if (fertilizerType.trim() && fertilizerQuantity <= 0) {
      newErrors.Fertilizer_quantity = 'Fertilizer quantity must be greater than 0 if Fertilizer Type is provided';
    }

    if (inputs.Water_Requirement && inputs.Water_Requirement.length > 100) {
      newErrors.Water_Requirement = 'Water Requirement cannot exceed 100 characters';
    }

    if (inputs.Expected_Yield && !/^\d+(\.\d{1,2})?$/.test(inputs.Expected_Yield)) {
      newErrors.Expected_Yield = 'Expected Yield must be a valid number (e.g., 100 or 100.50)';
    }

    if (inputs.planting_date && inputs.harvest_time) {
      const plantingDate = new Date(inputs.planting_date);
      const harvestDate = new Date(inputs.harvest_time);
      if (harvestDate <= plantingDate) {
        newErrors.harvest_time = 'Harvest date must be after planting date';
      }
    }

    customFields.forEach((field, index) => {
      if (!field.name.trim()) {
        newErrors[`custom_name_${index}`] = 'Field name is required';
      }
      if (!field.value.trim() && field.value !== '0') {
        newErrors[`custom_value_${index}`] = "Enter value or '-'";
      }
    });

    setErrors(newErrors);
    setMissingFields(missing);

    return Object.values(newErrors).every((error) => error === '') && missing.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      confirmAdd();
    } else {
      setShowPopup(true);
    }
  };

  const confirmAdd = async () => {
    try {
      await sendRequest();
      setSuccessMessage('Successfully added new details');
      setShowPopup(false);
      setTimeout(() => {
        navigate('/Crop_History');
      }, 2000);
    } catch (error) {
      console.error('Error adding crop:', error);
      setShowPopup(false);
      setErrorMessage(error.response?.data?.message || 'Error adding crop. Please try again.');
    }
  };

  const cancelAdd = () => {
    setShowPopup(false);
    navigate('/Crop_Add');
  };

  const sendRequest = async () => {
    const token = localStorage.getItem('token');
    const payload = {
      crop_name: inputs.crop_name.trim() === '-' ? '' : String(inputs.crop_name),
      crop_quantity: inputs.crop_quantity === '' || inputs.crop_quantity.trim() === '-' ? 0 : Number(inputs.crop_quantity),
      soil_type: inputs.soil_type.trim() === '-' ? '' : String(inputs.soil_type),
      planting_date: inputs.planting_date.trim() === '-' ? '' : inputs.planting_date,
      harvest_time: inputs.harvest_time.trim() === '-' ? '' : inputs.harvest_time,
      Fertilizer_Type: inputs.Fertilizer_Type.trim() === '-' ? '' : String(inputs.Fertilizer_Type),
      Fertilizer_quantity: inputs.Fertilizer_quantity === '' || inputs.Fertilizer_quantity.trim() === '-' ? 0 : Number(inputs.Fertilizer_quantity),
      Water_Requirement: inputs.Water_Requirement.trim() === '-' ? '' : String(inputs.Water_Requirement),
      Expected_Yield: inputs.Expected_Yield.trim() === '-' ? '' : String(inputs.Expected_Yield),
      Weather_Conditions: inputs.Weather_Conditions.trim() === '-' ? '' : String(inputs.Weather_Conditions),
      customFields: customFields.reduce((acc, field) => {
        acc[field.name] = field.value.trim() === '-' ? '' : field.value;
        return acc;
      }, {}),
    };
    const response = await axios.post('http://localhost:5000/CropR', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  return (
    <>
  
      <div className="crop-add-page">
        <Link to="/Crop_History" className="crop-add-back-btn">
          <button>Back</button>
        </Link>
        <h1 className="crop-add-title">ADD CROP DETAILS</h1>
        <div className="crop-add-form-container">
          <form onSubmit={handleSubmit} className="crop-add-form">
            <div className="crop-add-form-group">
              <label>Crop Name:</label>
              <input type="text" name="crop_name" value={inputs.crop_name} onChange={handleChange} required />
              {errors.crop_name && <span className="crop-add-error">{errors.crop_name}</span>}
            </div>
            <div className="crop-add-form-group">
              <label>Crop Quantity:</label>
              <input type="number" name="crop_quantity" value={inputs.crop_quantity} onChange={handleChange} />
              {errors.crop_quantity && <span className="crop-add-error">{errors.crop_quantity}</span>}
            </div>
            <div className="crop-add-form-group">
              <label>Soil Type:</label>
              <input
                type="text"
                name="soil_type"
                value={inputs.soil_type}
                onChange={handleSoilTypeChange}
                placeholder="Type or select soil type"
                list="soilTypeOptions"
              />
              <datalist id="soilTypeOptions">
                {soilTypes.map((type) => (
                  <option key={type} value={type} />
                ))}
              </datalist>
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
              <h2>{missingFields.length > 0 ? 'Missing Fields' : 'Confirm Addition'}</h2>
              {missingFields.length > 0 ? (
                <>
                  <p>The following fields are empty (except Crop Name, which is required):</p>
                  <ul>
                    {missingFields.map((field, index) => (
                      <li key={index}>{field}</li>
                    ))}
                  </ul>
                  <p>Do you want to proceed anyway?</p>
                </>
              ) : (
                <p>Are you sure you want to add these crop details?</p>
              )}
              <div className="crop-add-popup-buttons">
                <button onClick={confirmAdd} className="crop-add-confirm-btn">
                  {missingFields.length > 0 ? 'Submit Anyway' : 'ADD'}
                </button>
                <button onClick={cancelAdd} className="crop-add-cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="crop-add-success-message">
            <p>{successMessage}</p>
          </div>
        )}
        {errorMessage && (
          <div className="crop-add-error-message">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Crop_Add;