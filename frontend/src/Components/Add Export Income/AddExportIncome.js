import React, { useState } from 'react';
import { useNavigate } from "react-router";
import axios from "axios";
import './AddExportIncome.css';

function AddExportIncome() {
  const history = useNavigate();
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
    await axios.post("http://localhost:5000/exportincome", {
      ...inputs,
      dateOfExported: new Date(inputs.dateOfExported),
    }).then(res => res.data);
  };

  return (
    <div className="addExport-container">
      <div className="addExport-form-wrapper">
        <h1 className="addExport-heading">Add Export Income</h1>

        {/* Back Button */}
        <button className="addExport-back-btn" onClick={() => history('/mainincomehome')}>
          ← Back to Home
        </button>

        <form className="addExport-form" onSubmit={handleSubmit}>
          {[
            { label: "Product Name", name: "productName", type: "text" },
            { label: "Quantity Exported", name: "quantityExported", type: "text" },
            { label: "Exported Price", name: "exportedPrice", type: "text" },
            { label: "Destination Country", name: "destinationCtry", type: "text" },
            { label: "Exported Company", name: "exportedCompany", type: "text" },
            { label: "Shipping/Custom Cost", name: "shipping_CustomCost", type: "text" },
            { label: "Date Of Exported", name: "dateOfExported", type: "date" },
            { label: "Total Export Revenue", name: "totalExportRevenue", type: "text" },
          ].map((field) => (
            <div key={field.name} className="addExport-field">
              <label className="addExport-label">{field.label}</label>
              <input
                className="addExport-input"
                type={field.type}
                name={field.name}
                onChange={handleChange}
                value={inputs[field.name]}
                required
              />
              {errors[field.name] && <span className="addExport-error">{errors[field.name]}</span>}
            </div>
          ))}

          <button className="addExport-submit-btn" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddExportIncome;



