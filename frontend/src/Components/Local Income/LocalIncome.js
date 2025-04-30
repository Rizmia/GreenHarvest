/*import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LocalIncome({ localincome }) {
    const {
        _id,
        productName,
        quantitySold,
        pricePerUnit,
        BuyerName,
        paymentMethod,
        dateOfSale,
        description,
        totalRevenue
    } = localincome;

    const history = useNavigate();

    const deleteHandler = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/localincome/${_id}`);
            alert("Local income deleted successfully!");
            history("/localincomedetails");
        } catch (error) {
            console.error("Error deleting income:", error.response ? error.response.data : error);
            alert("Failed to delete the local income.");
        }
    };

    return (
        <tr>
            <td>{_id}</td>
            <td>{productName}</td>
            <td>{quantitySold}</td>
            <td>{pricePerUnit}</td>
            <td>{BuyerName}</td>
            <td>{paymentMethod}</td>
            <td>{new Date(dateOfSale).toLocaleDateString()}</td>
            <td>{description}</td>
            <td>{totalRevenue}</td>
            <td>
                <Link to={`/localincomedetails/${_id}`} className="update-link">Update</Link>
                <button onClick={deleteHandler} className="delete-btn">Delete</button>
            </td>
        </tr>
    );
}

export default LocalIncome;*/


import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LocalIncome({ localincome }) {
    const {
        _id,
        productName,
        quantitySold,
        pricePerUnit,
        BuyerName,
        paymentMethod,
        dateOfSale,
        description,
        totalRevenue
    } = localincome;

    const history = useNavigate();

    const deleteHandler = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/localincome/${_id}`);
            alert("Local income deleted successfully!");
            history("/localincomedetails");
        } catch (error) {
            console.error("Error deleting income:", error.response ? error.response.data : error);
            alert("Failed to delete the local income.");
        }
    };

    return (
        <tr className="localIncome-row">
            <td className="localIncome-cell">{_id}</td>
            <td className="localIncome-cell">{productName}</td>
            <td className="localIncome-cell">{quantitySold}</td>
            <td className="localIncome-cell">{pricePerUnit}</td>
            <td className="localIncome-cell">{BuyerName}</td>
            <td className="localIncome-cell">{paymentMethod}</td>
            <td className="localIncome-cell">{new Date(dateOfSale).toLocaleDateString()}</td>
            <td className="localIncome-cell">{description}</td>
            <td className="localIncome-cell">{totalRevenue}</td>
            <td className="localIncome-cell">
                <Link to={`/localincomedetails/${_id}`} className="localIncome-update-link">Update</Link>
                <button onClick={deleteHandler} className="localIncome-delete-btn">Delete</button>
            </td>
        </tr>
    );
}

export default LocalIncome;






