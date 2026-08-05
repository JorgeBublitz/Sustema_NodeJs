import { Router } from "express";
import appointmentController from "../controllers/appointmentController";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createAppointmentSchema, updateAppointmentSchema, idParamSchema } from "../schemas";

const router = Router();

router.get("/", appointmentController.getAllAppointments);
router.get("/:id", validate(idParamSchema, "params"), appointmentController.getAppointmentById);

// Escrita apenas para ADMIN e SECRETARY
router.post("/", authorize("ADMIN", "SECRETARY"), validate(createAppointmentSchema), appointmentController.createAppointment);
router.put("/:id", authorize("ADMIN", "SECRETARY"), validate(idParamSchema, "params"), validate(updateAppointmentSchema), appointmentController.updateAppointment);
router.delete("/:id", authorize("ADMIN", "SECRETARY"), validate(idParamSchema, "params"), appointmentController.deleteAppointment);

export default router;
