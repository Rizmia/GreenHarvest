/*import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import './UpdateExportIncome.css';

function UpdateExportIncome() {
  const history = useNavigate();
  const { id } = useParams();

  const [inputs, setInputs] = useState({
    productName: "",
    quantityExported: "",
    exportedPrice: "",
    destinationCtry: "",
    exportedCompany: "",
    shipping_CustomCost: "",
    dateOfExported: "",
    totalExportRevenue: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/exportincome/${id}`);
        if (res?.data?.exportincome) {
          const { __v, _id, ...cleanedData } = res.data.exportincome;
          setInputs(cleanedData);
        }
      } catch (error) {
        console.error("Error fetching export income:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const validateInput = (name, value) => {
    let error = "";

    if (!value.trim()) {
      error = "This field is required.";
    } else {
      switch (name) {
        case "quantityExported":
          if (!/^\d+(Kg|kg|G|g)$/.test(value)) {
            error = "Use numbers followed by 'Kg', 'kg', 'G', or 'g'. Example: 500Kg";
          }
          break;

        case "exportedPrice":
        case "shipping_CustomCost":
        case "totalExportRevenue":
          if (!/^Rs\.\s*\d+$/.test(value)) {
            error = "Use 'Rs.' followed by a number. Example: Rs. 2000";
          }
          break;

        default:
          break;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    validateInput(name, value);
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    let newErrors = {};

    Object.keys(inputs).forEach((key) => {
      validateInput(key, inputs[key]);
      if (!inputs[key] || errors[key]) {
        newErrors[key] = errors[key] || "This field is required.";
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      sendRequest().then(() => history("/exportincomedetails"));
    }
  };

  const sendRequest = async () => {
    await axios.put(`http://localhost:5000/exportincome/${id}`, {
      productName: String(inputs.productName),
      quantityExported: String(inputs.quantityExported),
      exportedPrice: String(inputs.exportedPrice),
      destinationCtry: String(inputs.destinationCtry),
      exportedCompany: String(inputs.exportedCompany),
      shipping_CustomCost: String(inputs.shipping_CustomCost),
      dateOfExported: new Date(inputs.dateOfExported),
      totalExportRevenue: String(inputs.totalExportRevenue),
    });
  };

  return (
    <div className="updateExport-container">
      <div className="updateExport-form-container">
        <h1 className="updateExport-title">Update Export Income</h1>

        <div className="updateExport-back-buttons">
          <button className="updateExport-back-btn" onClick={() => history('/mainincomehome')}>
            ← Back to Home
          </button>
          <button className="updateExport-back-btn" onClick={() => history('/exportincomedetails')}>
            ← Back to Export Income Details
          </button>
        </div>

        <form onSubmit={handleSubmit} className="updateExport-form">
          <label>Product Name</label>
          <input type="text" name="productName" value={inputs.productName} onChange={handleChange} />
          {errors.productName && <span className="updateExport-error">{errors.productName}</span>}

          <label>Quantity Exported</label>
          <input type="text" name="quantityExported" value={inputs.quantityExported} onChange={handleChange} />
          {errors.quantityExported && <span className="updateExport-error">{errors.quantityExported}</span>}

          <label>Exported Price</label>
          <input type="text" name="exportedPrice" value={inputs.exportedPrice} onChange={handleChange} />
          {errors.exportedPrice && <span className="updateExport-error">{errors.exportedPrice}</span>}

          <label>Destination Country</label>
          <input type="text" name="destinationCtry" value={inputs.destinationCtry} onChange={handleChange} />
          {errors.destinationCtry && <span className="updateExport-error">{errors.destinationCtry}</span>}

          <label>Exported Company</label>
          <input type="text" name="exportedCompany" value={inputs.exportedCompany} onChange={handleChange} />
          {errors.exportedCompany && <span className="updateExport-error">{errors.exportedCompany}</span>}

          <label>Shipping/Custom Cost</label>
          <input type="text" name="shipping_CustomCost" value={inputs.shipping_CustomCost} onChange={handleChange} />
          {errors.shipping_CustomCost && <span className="updateExport-error">{errors.shipping_CustomCost}</span>}

          <label>Date Of Exported</label>
          <input
            type="date"
            name="dateOfExported"
            value={inputs.dateOfExported?.split("T")[0] || ""}
            onChange={handleChange}
          />
          {errors.dateOfExported && <span className="updateExport-error">{errors.dateOfExported}</span>}

          <label>Total Export Revenue</label>
          <input type="text" name="totalExportRevenue" value={inputs.totalExportRevenue} onChange={handleChange} />
          {errors.totalExportRevenue && <span className="updateExport-error">{errors.totalExportRevenue}</span>}

          <button type="submit" className="updateExport-submit-btn">Update</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateExportIncome;*/


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import './UpdateExportIncome.css';

function UpdateExportIncome() {
  const history = useNavigate();
  const { id } = useParams();

  const [inputs, setInputs] = useState({
    productName: "",
    quantityExported: "",
    exportedPrice: "",
    destinationCtry: "",
    exportedCompany: "",
    shipping_CustomCost: "",
    dateOfExported: "",
    totalExportRevenue: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/exportincome/${id}`);
        if (res?.data?.income) {
          const { __v, _id, ...cleanedData } = res.data.income;
          cleanedData.dateOfExported = cleanedData.dateOfExported?.split("T")[0] || "";
          setInputs(cleanedData);
        }
      } catch (error) {
        console.error("Error fetching export income:", error);
        alert("Failed to load export income data.");
      }
    };
    fetchHandler();
  }, [id]);

  const validateInput = (name, value) => {
    let error = "";

    if (!value.trim()) {
      error = "This field is required.";
    } else {
      switch (name) {
        case "quantityExported":
          if (!/^\d+(Kg|kg|G|g)$/.test(value)) {
            error = "Use numbers followed by 'Kg', 'kg', 'G', or 'g'. Example: 500Kg";
          }
          break;

        case "exportedPrice":
        case "shipping_CustomCost":
        case "totalExportRevenue":
          if (!/^Rs\.\s*\d+$/.test(value)) {
            error = "Use 'Rs.' followed by a number. Example: Rs. 2000";
          }
          break;

        default:
          break;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    validateInput(name, value);
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    let newErrors = {};

    Object.keys(inputs).forEach((key) => {
      validateInput(key, inputs[key]);
      if (!inputs[key] || errors[key]) {
        newErrors[key] = errors[key] || "This field is required.";
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      try {
        const response = await axios.put(`http://localhost:5000/exportincome/${id}`, {
          productName: String(inputs.productName),
          quantityExported: String(inputs.quantityExported),
          exportedPrice: String(inputs.exportedPrice),
          destinationCtry: String(inputs.destinationCtry),
          exportedCompany: String(inputs.exportedCompany),
          shipping_CustomCost: String(inputs.shipping_CustomCost),
          dateOfExported: new Date(inputs.dateOfExported),
          totalExportRevenue: String(inputs.totalExportRevenue),
        });

        console.log("Update success:", response.data);
        alert("Export income updated successfully!");
        history("/exportincomedetails");
      } catch (error) {
        console.error("Update failed:", error.response?.data || error.message);
        alert("Update failed: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="updateExport-container">
      <div className="updateExport-form-container">
        <h1 className="updateExport-title">Update Export Income</h1>

        <div className="updateExport-back-buttons">
          <button className="updateExport-back-btn" onClick={() => history('/mainincomehome')}>
            ← Back to Home
          </button>
          <button className="updateExport-back-btn" onClick={() => history('/exportincomedetails')}>
            ← Back to Export Income Details
          </button>
        </div>

        <form onSubmit={handleSubmit} className="updateExport-form">
          <label>Product Name</label>
          <input type="text" name="productName" value={inputs.productName} onChange={handleChange} />
          {errors.productName && <span className="updateExport-error">{errors.productName}</span>}

          <label>Quantity Exported</label>
          <input type="text" name="quantityExported" value={inputs.quantityExported} onChange={handleChange} />
          {errors.quantityExported && <span className="updateExport-error">{errors.quantityExported}</span>}

          <label>Exported Price</label>
          <input type="text" name="exportedPrice" value={inputs.exportedPrice} onChange={handleChange} />
          {errors.exportedPrice && <span className="updateExport-error">{errors.exportedPrice}</span>}

          <label>Destination Country</label>
          <input type="text" name="destinationCtry" value={inputs.destinationCtry} onChange={handleChange} />
          {errors.destinationCtry && <span className="updateExport-error">{errors.destinationCtry}</span>}

          <label>Exported Company</label>
          <input type="text" name="exportedCompany" value={inputs.exportedCompany} onChange={handleChange} />
          {errors.exportedCompany && <span className="updateExport-error">{errors.exportedCompany}</span>}

          <label>Shipping/Custom Cost</label>
          <input type="text" name="shipping_CustomCost" value={inputs.shipping_CustomCost} onChange={handleChange} />
          {errors.shipping_CustomCost && <span className="updateExport-error">{errors.shipping_CustomCost}</span>}

          <label>Date Of Exported</label>
          <input
            type="date"
            name="dateOfExported"
            value={inputs.dateOfExported}
            onChange={handleChange}
          />
          {errors.dateOfExported && <span className="updateExport-error">{errors.dateOfExported}</span>}

          <label>Total Export Revenue</label>
          <input type="text" name="totalExportRevenue" value={inputs.totalExportRevenue} onChange={handleChange} />
          {errors.totalExportRevenue && <span className="updateExport-error">{errors.totalExportRevenue}</span>}

          <button type="submit" className="updateExport-submit-btn">Update</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateExportIncome;


