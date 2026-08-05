import { Router } from "express";
import patientController from "../controllers/patientController";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createPatientSchema, updatePatientSchema, idParamSchema } from "../schemas";

const router = Router();

router.get("/", patientController.getAllPatient);
router.get("/:id", validate(idParamSchema, "params"), patientController.getPatientById);

// Escrita apenas para ADMIN e SECRETARY
router.post("/", authorize("ADMIN", "SECRETARY"), validate(createPatientSchema), patientController.createPatient);
router.put("/:id", authorize("ADMIN", "SECRETARY"), validate(idParamSchema, "params"), validate(updatePatientSchema), patientController.updatePatient);
router.delete("/:id", authorize("ADMIN", "SECRETARY"), validate(idParamSchema, "params"), patientController.deletePatient);

export default router;
