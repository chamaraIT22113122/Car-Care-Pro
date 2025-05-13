import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js"; // ✅ Use ES module import

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router; // ✅ Use ES module export
