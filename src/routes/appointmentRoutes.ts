import { Router } from "express";
import appointmentController from "../controllers/appointmentController";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createAppointmentSchema, updateAppointmentSchema, idParamSchema } from "../schemas";

const router = Router();

router.get("/", appointmentController.getAll);
router.get("/:id", validate(idParamSchema, "params"), appointmentController.getById);

// Escrita apenas para ADMIN e SECRETARY
router.post("/", authorize("ADMIN", "SECRETARY"), validate(createAppointmentSchema), appointmentController.create);
router.put("/:id", authorize("ADMIN", "SECRETARY"), validate(idParamSchema, "params"), validate(updateAppointmentSchema), appointmentController.update);
router.delete("/:id", authorize("ADMIN", "SECRETARY"), validate(idParamSchema, "params"), appointmentController.delete);

export default router;
