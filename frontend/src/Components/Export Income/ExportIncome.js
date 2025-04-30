import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function ExportIncome({ exportincome }) {
    const {
        _id,
        productName,
        quantityExported,
        exportedPrice,
        destinationCtry,
        exportedCompany,
        shipping_CustomCost,
        dateOfExported,
        totalExportRevenue
    } = exportincome;

    const navigate = useNavigate();

    const deleteHandler = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/exportincome/${_id}`);
            alert("Export income deleted successfully!");
            navigate("/exportincomedetails");
        } catch (error) {
            console.error("Error deleting export income:", error.response ? error.response.data : error);
            alert("Failed to delete the export income.");
        }
    };

    return (
        <tr className="exportIncome-row">
            <td className="exportIncome-cell">{_id}</td>
            <td className="exportIncome-cell">{productName}</td>
            <td className="exportIncome-cell">{quantityExported}</td>
            <td className="exportIncome-cell">{exportedPrice}</td>
            <td className="exportIncome-cell">{destinationCtry}</td>
            <td className="exportIncome-cell">{exportedCompany}</td>
            <td className="exportIncome-cell">{shipping_CustomCost}</td>
            <td className="exportIncome-cell">{new Date(dateOfExported).toLocaleDateString()}</td>
            <td className="exportIncome-cell">{totalExportRevenue}</td>
            <td className="exportIncome-actions">
                <Link to={`/exportincomedetails/${_id}`} className="exportIncome-update-link">Update</Link>
                <button onClick={deleteHandler} className="exportIncome-delete-btn">Delete</button>
            </td>
        </tr>
    );
}

export default ExportIncome;

