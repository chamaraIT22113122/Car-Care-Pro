import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppointmentForm = ({ onAppointmentAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    time: "",
    date: "",
    msg: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) errors.name = "Name is required";
    
    // Email validation
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Invalid email format";

    // Phone number validation: start with 0 and must be exactly 10 digits
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^0\d{9}$/.test(formData.phone)) errors.phone = "Phone number must start with 0 and contain exactly 10 digits";
    
    // Vehicle type validation
    if (!formData.vehicle.trim()) errors.vehicle = "Vehicle type is required";

    // Time validation
    if (!formData.time.trim()) errors.time = "Time is required";

    // Date validation
    if (!formData.date.trim()) errors.date = "Date is required";

    // Message validation
    if (!formData.msg.trim()) errors.msg = "Message is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:4000/api/appointments", formData);
        
        if (response.status === 200 || response.status === 201) {
          toast.success("Appointment booked successfully!");
          setFormData({ name: "", email: "", phone: "", vehicle: "", time: "", date: "", msg: "" });
          
          if (onAppointmentAdded) {
            onAppointmentAdded();
          }
        } else {
          toast.error("Failed to book appointment. Please try again.");
        }
        
      } catch (error) {
        toast.error("Failed to book appointment. Please check your network and try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="appointment-form p-4">
        <h2 className="text-white text-uppercase">Request for an Appointment</h2>
        <p className="text-white-50">Car care Pro</p>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label text-white">Full Name*</label>
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} />
              {formErrors.name && <small className="text-danger">{formErrors.name}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label text-white">Email*</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} />
              {formErrors.email && <small className="text-danger">{formErrors.email}</small>}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <label className="form-label text-white">Phone Number*</label>
              <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleInputChange} />
              {formErrors.phone && <small className="text-danger">{formErrors.phone}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label text-white">Vehicle Type*</label>
              <input type="text" name="vehicle" className="form-control" value={formData.vehicle} onChange={handleInputChange} />
              {formErrors.vehicle && <small className="text-danger">{formErrors.vehicle}</small>}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <label className="form-label text-white">Select Time*</label>
              <input type="time" name="time" className="form-control" value={formData.time} onChange={handleInputChange} />
              {formErrors.time && <small className="text-danger">{formErrors.time}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label text-white">Select Date*</label>
              <input type="date" name="date" className="form-control" value={formData.date} onChange={handleInputChange} />
              {formErrors.date && <small className="text-danger">{formErrors.date}</small>}
            </div>
          </div>

          <div className="mt-3">
            <label className="form-label text-white">Your Message*</label>
            <textarea name="msg" rows="4" className="form-control" value={formData.msg} onChange={handleInputChange} />
            {formErrors.msg && <small className="text-danger">{formErrors.msg}</small>}
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-danger w-100">APPOINTMENT NOW</button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .appointment-form {
          background-color: #111;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
        }
        .btn-danger {
          background-color: #ff0000;
          border: none;
          padding: 10px;
          font-size: 18px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .btn-danger:hover {
          background-color: #cc0000;
        }
      `}</style>
    </div>
  );
};

export default AppointmentForm;
