import React, { useState } from 'react';
import { useNavigate } from "react-router";
import axios from "axios";
import './AddLocalIncome.css';

function AddLocalIncome() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    productName: "",
    quantitySold: "",
    pricePerUnit: "",
    BuyerName: "",
    paymentMethod: "",
    dateOfSale: "",
    description: "",
    totalRevenue: "",
  });

  const [errors, setErrors] = useState({});

  const paymentMethods = ["Cash", "Credit", "Bank Transfer"];

  const validateInput = (name, value) => {
    let error = "";

    if (!value.trim()) {
      error = "This field is required.";
    } else {
      switch (name) {
        case "quantitySold":
          if (!/^\d+(Kg|kg|G|g)$/.test(value)) {
            error = "Invalid format! Use numbers followed by 'Kg', 'kg', 'G', or 'g'. Example: 566Kg, 10g";
          }
          break;
        case "pricePerUnit":
        case "totalRevenue":
          if (!/^Rs\.\s*\d+$/.test(value)) {
            error = "Invalid format! Use 'Rs.' followed by a number. Example: Rs. 3000";
          }
          break;
        case "paymentMethod":
          if (!paymentMethods.includes(value)) {
            error = "Invalid payment method! Choose from Cash, Credit, or Bank Transfer.";
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
      sendRequest().then(() => history("/localincomedetails"));
    }
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:5000/localincome", {
      productName: String(inputs.productName),
      quantitySold: String(inputs.quantitySold),
      pricePerUnit: String(inputs.pricePerUnit),
      BuyerName: String(inputs.BuyerName),
      paymentMethod: String(inputs.paymentMethod),
      dateOfSale: new Date(inputs.dateOfSale),
      description: String(inputs.description),
      totalRevenue: String(inputs.totalRevenue.replace("Rs. ", "")),
    }).then(res => res.data);
  };

  return (
    <div className="addLocal-container">
      <div className="addLocal-form-container">
        <h1 className="addLocal-heading">Add Income</h1>

        <button className="addLocal-back-btn" onClick={() => history('/mainincomehome')}>
          ← Back to Home
        </button>

        <form onSubmit={handleSubmit} className="addLocal-form">
          <label>Product Name</label>
          <input type="text" name="productName" onChange={handleChange} value={inputs.productName} required />
          {errors.productName && <span className="addLocal-error">{errors.productName}</span>}

          <label>Quantity Sold</label>
          <input type="text" name="quantitySold" onChange={handleChange} value={inputs.quantitySold} required />
          {errors.quantitySold && <span className="addLocal-error">{errors.quantitySold}</span>}

          <label>Price Per Unit</label>
          <input type="text" name="pricePerUnit" onChange={handleChange} value={inputs.pricePerUnit} required />
          {errors.pricePerUnit && <span className="addLocal-error">{errors.pricePerUnit}</span>}

          <label>Buyer Name</label>
          <input type="text" name="BuyerName" onChange={handleChange} value={inputs.BuyerName} required />
          {errors.BuyerName && <span className="addLocal-error">{errors.BuyerName}</span>}

          <label>Payment Method</label>
          <select name="paymentMethod" onChange={handleChange} value={inputs.paymentMethod} required>
            <option value="">Select Payment Method</option>
            {paymentMethods.map((method, index) => (
              <option key={index} value={method}>{method}</option>
            ))}
          </select>
          {errors.paymentMethod && <span className="addLocal-error">{errors.paymentMethod}</span>}

          <label>Date Of Sale</label>
          <input type="date" name="dateOfSale" onChange={handleChange} value={inputs.dateOfSale} required />
          {errors.dateOfSale && <span className="addLocal-error">{errors.dateOfSale}</span>}

          <label>Description</label>
          <input type="text" name="description" onChange={handleChange} value={inputs.description} required />
          {errors.description && <span className="addLocal-error">{errors.description}</span>}

          <label>Total Revenue</label>
          <input type="text" name="totalRevenue" onChange={handleChange} value={inputs.totalRevenue} required />
          {errors.totalRevenue && <span className="addLocal-error">{errors.totalRevenue}</span>}

          <button type="submit" className="addLocal-submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddLocalIncome;









