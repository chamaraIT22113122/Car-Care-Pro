import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import EditAppointmentForm from "./EditAppointmentForm";
import "./ListAppointment.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const ListAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track the ID of the appointment being edited
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const response = await axios.get("http://localhost:4000/api/appointments");
    setAppointments(response.data);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:4000/api/appointments/${id}`);
        fetchAppointments();
        Swal.fire("Deleted!", "The appointment has been deleted.", "success");
      }
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Car Care Pro", 105, 10, { align: "center" });
    doc.text("Address: Yakkala, Sri Lanka", 105, 20, { align: "center" });
    doc.text(`Total Appointments: ${appointments.length}`, 105, 30, { align: "center" });
    
    const tableColumn = ["Name", "Email", "Phone", "Vehicle", "Time", "Date", "Message"];
    const tableRows = appointments.map((appointment) => [
      appointment.name,
      appointment.email,
      appointment.phone,
      appointment.vehicle,
      appointment.time,
      appointment.date,
      appointment.msg,
    ]);
    
    doc.autoTable({ startY: 40, head: [tableColumn], body: tableRows });
    doc.save("appointments_report.pdf");
    
    Swal.fire({
      title: "Report Generated!",
      text: "The PDF report has been downloaded successfully.",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="list-appointment">
      <div className="list-appointment-container">
        <h2 className="title">All Appointments</h2>
        <div className="controls">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="generate-report-btn" onClick={generatePDF}>
            Generate PDF Report
          </button>
        </div>
        {editingId ? (
          <EditAppointmentForm
            appointmentId={editingId}
            onUpdate={fetchAppointments}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Vehicle</th>
                  <th>Time</th>
                  <th>Date</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.name}</td>
                    <td>{appointment.email}</td>
                    <td>{appointment.phone}</td>
                    <td>{appointment.vehicle}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.msg}</td>
                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => setEditingId(appointment._id)} // Set the ID of the appointment to edit
                      >
                        <FaEdit />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(appointment._id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListAppointment;
