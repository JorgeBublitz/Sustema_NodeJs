import { Router } from "express";
import patientController from "../controllers/patientController";
import { authorize } from "../middlewares/auth";

const router = Router();

router.get("/", patientController.getAllPatient);
router.get("/:id", patientController.getPatientById);

// Escrita apenas para ADMIN e SECRETARY
router.post("/", authorize("ADMIN", "SECRETARY"), patientController.createPatient);
router.put("/:id", authorize("ADMIN", "SECRETARY"), patientController.updatePatient);
router.delete("/:id", authorize("ADMIN", "SECRETARY"), patientController.deletePatient);

export default router;
