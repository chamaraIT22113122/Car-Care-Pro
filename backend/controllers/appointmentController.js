import Appointment from "../models/Appointment.js"; // ✅ Use ES module import

// Create an appointment
export const createAppointment = async (req, res) => { // ✅ Use export keyword
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all appointments
export const getAppointments = async (req, res) => { // ✅ Use export keyword
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single appointment
export const getAppointmentById = async (req, res) => { // ✅ Use export keyword
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an appointment
export const updateAppointment = async (req, res) => { // ✅ Use export keyword
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => { // ✅ Use export keyword
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
