import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Crops.css';

function Crops(props) {
  const {
    _id,
    crop_name,
    crop_quantity,
    soil_type,
    planting_date,
    harvest_time,
    Fertilizer_Type,
    Fertilizer_quantity,
    Water_Requirement,
    Expected_Yield,
    Weather_Conditions,
    customFields = {},
  } = props.user;

  const { onDelete, customFields: allCustomFields } = props;
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleDeleteClick = () => {
    setShowPopup(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/CropR/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(_id);
      setShowPopup(false);
    } catch (error) {
      console.error('Error deleting crop:', error);
      setShowPopup(false);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/Login');
      }
    }
  };

  const cancelDelete = () => {
    setShowPopup(false);
  };

  return (
    <>
      <tr className="crop-row">
        <td>{_id}</td>
        <td>{crop_name}</td>
        <td>{crop_quantity}</td>
        <td>{soil_type}</td>
        <td>{new Date(planting_date).toLocaleDateString()}</td>
        <td>{new Date(harvest_time).toLocaleDateString()}</td>
        <td>{Fertilizer_Type}</td>
        <td>{Fertilizer_quantity}</td>
        <td>{Water_Requirement}</td>
        <td>{Expected_Yield}</td>
        <td>{Weather_Conditions}</td>
        {allCustomFields.map((field) => (
          <td key={field}>{customFields[field] || '-'}</td>
        ))}
        <td className="action-buttons">
          <Link to={`/Crop_History/${_id}`} className="edit-btn">Edit</Link>
          <button onClick={handleDeleteClick} className="delete-btn">Delete</button>
        </td>
      </tr>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete these details?</p>
            <div className="popup-buttons">
              <button onClick={confirmDelete} className="yes-btn">Yes</button>
              <button onClick={cancelDelete} className="no-btn">No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Crops;