import { Router } from "express";
import patientController from "../controllers/patientController";

const router = Router();

// GET all users
router.get("/", patientController.getAllPatient);

// GET user by ID
router.get("/:id", patientController.getPatientById);

// POST create user
router.post("/", patientController.createPatient);

// PUT update user
router.put("/:id", patientController.updatePatient);

// DELETE user
router.delete("/:id", patientController.deletePatient);

export default router;
