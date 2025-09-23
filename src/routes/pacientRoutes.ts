import { Router } from "express";
import patientController from "../controllers/patientController";

const router = Router();

router.get("/", patientController.getAllPatient);
router.get("/:id", patientController.getPatientById);
router.post("/", patientController.createPatient);
router.put("/:id", patientController.updatePatient);
router.delete("/:id", patientController.deletePatient);

export default router;
