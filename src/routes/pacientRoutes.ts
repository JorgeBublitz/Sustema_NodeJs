import { Router } from "express";
import patientController from "../controllers/patientController";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createPatientSchema, updatePatientSchema, idParamSchema } from "../schemas";

const router = Router();

router.get("/", patientController.getAll);
router.get("/:id", validate(idParamSchema, "params"), patientController.getById);

// Escrita apenas para ADMIN e SECRETARY
router.post("/", authorize("ADMIN", "SECRETARY"), validate(createPatientSchema), patientController.create);
router.put("/:id", authorize("ADMIN", "SECRETARY"), validate(idParamSchema, "params"), validate(updatePatientSchema), patientController.update);
router.delete("/:id", authorize("ADMIN", "SECRETARY"), validate(idParamSchema, "params"), patientController.delete);

export default router;
