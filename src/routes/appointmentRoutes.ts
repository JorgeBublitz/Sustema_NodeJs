import { Router } from "express";
import appointmentController from "../controllers/appointmentController";

const router = Router();

// GET all users
router.get("/", appointmentController.getAllAppointments);

// GET user by ID
router.get("/:id", appointmentController.getAppointmentById);

// POST create user
router.post("/", appointmentController.createAppointment);

// PUT update user
router.put("/:id", appointmentController.updateAppointment);

// DELETE user
router.delete("/:id", appointmentController.deleteAppointment);

export default router;
