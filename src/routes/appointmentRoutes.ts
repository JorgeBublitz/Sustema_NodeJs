import { Router } from "express";
import appointmentController from "../controllers/appointmentController";
import { authorize } from "../middlewares/auth";

const router = Router();

router.get("/", appointmentController.getAllAppointments);
router.get("/:id", appointmentController.getAppointmentById);

// Escrita apenas para ADMIN e SECRETARY
router.post("/", authorize("ADMIN", "SECRETARY"), appointmentController.createAppointment);
router.put("/:id", authorize("ADMIN", "SECRETARY"), appointmentController.updateAppointment);
router.delete("/:id", authorize("ADMIN", "SECRETARY"), appointmentController.deleteAppointment);

export default router;
