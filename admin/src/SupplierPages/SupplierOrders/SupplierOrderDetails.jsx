import React from "react";
import "./Popup.css"; // Add your CSS for the popup styling

const SupplierOrderDetails = ({ order, onClose }) => {
  if (!order) return null; // If no order is selected, don't render anything

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Employee Payment Details</h2>
        <p><strong>Employee Name:</strong> {order.name}</p>
        <p><strong>Status:</strong> {order.productName}</p>
        <p><strong>Work Hours:</strong> {order.quantity}</p>
        <p><strong>Per Hour:</strong> Rs.{order.unitPrice.toFixed(2)}</p>
        <p><strong>Total Salary:</strong> Rs.{(order.quantity * order.unitPrice).toFixed(2)}</p>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default SupplierOrderDetails;
