import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const EditAppointmentForm = ({ appointmentId, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    time: "",
    date: "",
    msg: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:4000/api/appointments/${appointmentId}`).then((response) => {
      setFormData(response.data);
    });
  }, [appointmentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/appointments/${appointmentId}`, formData);
      Swal.fire({
        icon: 'success',
        title: 'Appointment updated successfully!',
        text: 'Your appointment details have been updated.',
        confirmButtonText: 'OK',
      });
      onUpdate(); // Refresh list
      navigate("/appointments"); // Redirect to the appointments list page
    } catch (error) {
      console.error("Error updating appointment:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'There was an error updating the appointment. Please try again.',
        confirmButtonText: 'Try Again',
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Appointment</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label" htmlFor="name">Name</label>
          <input type="text" name="name" id="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="email">Email</label>
          <input type="email" name="email" id="email" className="form-control" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="phone">Phone</label>
          <input type="text" name="phone" id="phone" className="form-control" value={formData.phone} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="vehicle">Vehicle</label>
          <input type="text" name="vehicle" id="vehicle" className="form-control" value={formData.vehicle} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="time">Time</label>
          <input type="time" name="time" id="time" className="form-control" value={formData.time} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="date">Date</label>
          <input type="date" name="date" id="date" className="form-control" value={formData.date} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="msg">Message</label>
          <textarea name="msg" id="msg" className="form-control" rows="5" value={formData.msg} onChange={handleInputChange} required />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success">Update Appointment</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditAppointmentForm;
