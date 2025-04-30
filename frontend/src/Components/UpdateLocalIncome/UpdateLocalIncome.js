import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import './UpdateLocalIncome.css';

function UpdateLocalIncome() {
  const history = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/localincome/${id}`);
        if (res?.data?.localincome) {
          const { __v, _id, ...cleanedData } = res.data.localincome;
          setInputs(cleanedData);
        }
      } catch (error) {
        console.error("Error fetching local income:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      const value = inputs[key];
      const strValue = value ? String(value).trim() : "";

      let error = "";
      if (!strValue) {
        error = "This field is required.";
      } else {
        switch (key) {
          case "quantitySold":
            if (!/^\d+(Kg|kg|G|g)$/.test(strValue)) {
              error = "Invalid format! Use numbers followed by 'Kg', 'kg', 'G', or 'g'. Example: 566Kg, 10g";
            }
            break;
          case "pricePerUnit":
          case "totalRevenue":
            if (!/^Rs\.\s*\d+$/.test(strValue)) {
              error = "Invalid format! Use 'Rs.' followed by a number. Example: Rs. 3000";
            }
            break;
          case "paymentMethod":
            if (!paymentMethods.includes(strValue)) {
              error = "Invalid payment method! Choose from Cash, Credit, or Bank Transfer.";
            }
            break;
          default:
            break;
        }
      }

      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      sendRequest().then(() => history("/localincomedetails"));
    }
  };

  const sendRequest = async () => {
    await axios.put(`http://localhost:5000/localincome/${id}`, {
      productName: String(inputs.productName),
      quantitySold: String(inputs.quantitySold),
      pricePerUnit: String(inputs.pricePerUnit),
      BuyerName: String(inputs.BuyerName),
      paymentMethod: String(inputs.paymentMethod),
      dateOfSale: new Date(inputs.dateOfSale),
      description: String(inputs.description),
      totalRevenue: String(inputs.totalRevenue.replace("Rs. ", "")),
    });
  };

  return (
    <div className="updateLocal-container">
      <div className="updateLocal-form-container">
        <h1>Update Income</h1>

        <div className="updateLocal-buttons">
          <button className="updateLocal-back-button" onClick={() => history('/')}>Back to Home</button>
          <button className="updateLocal-back-button" onClick={() => history('/localincomedetails')}>Back to Income Details</button>
        </div>

        <form className="updateLocal-form" onSubmit={handleSubmit}>
          <label>Product Name</label>
          <input type="text" name="productName" value={inputs.productName} onChange={handleChange} />
          {errors.productName && <span className="updateLocal-error">{errors.productName}</span>}

          <label>Quantity Sold</label>
          <input type="text" name="quantitySold" value={inputs.quantitySold} onChange={handleChange} />
          {errors.quantitySold && <span className="updateLocal-error">{errors.quantitySold}</span>}

          <label>Price Per Unit</label>
          <input type="text" name="pricePerUnit" value={inputs.pricePerUnit} onChange={handleChange} />
          {errors.pricePerUnit && <span className="updateLocal-error">{errors.pricePerUnit}</span>}

          <label>Buyer Name</label>
          <input type="text" name="BuyerName" value={inputs.BuyerName} onChange={handleChange} />
          {errors.BuyerName && <span className="updateLocal-error">{errors.BuyerName}</span>}

          <label>Payment Method</label>
          <select name="paymentMethod" value={inputs.paymentMethod} onChange={handleChange}>
            <option value="">Select Payment Method</option>
            {paymentMethods.map((method, idx) => (
              <option key={idx} value={method}>{method}</option>
            ))}
          </select>
          {errors.paymentMethod && <span className="updateLocal-error">{errors.paymentMethod}</span>}

          <label>Date Of Sale</label>
          <input type="date" name="dateOfSale" value={inputs.dateOfSale?.split("T")[0] || ""} onChange={handleChange} />
          {errors.dateOfSale && <span className="updateLocal-error">{errors.dateOfSale}</span>}

          <label>Description</label>
          <input type="text" name="description" value={inputs.description} onChange={handleChange} />
          {errors.description && <span className="updateLocal-error">{errors.description}</span>}

          <label>Total Revenue</label>
          <input type="text" name="totalRevenue" value={inputs.totalRevenue} onChange={handleChange} />
          {errors.totalRevenue && <span className="updateLocal-error">{errors.totalRevenue}</span>}

          <button className="updateLocal-submit-button" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateLocalIncome;


