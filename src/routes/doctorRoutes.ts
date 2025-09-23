import { Router } from "express";
import doctorController from "../controllers/doctorController";

const router = Router();

// GET all doctors
router.get("/", doctorController.getAllDoctors);

// GET doctor by ID
router.get("/:id", doctorController.getDoctorById);

// POST create doctor
router.post("/", doctorController.createDoctor);

// PUT update doctor
router.put("/:id", doctorController.updateDoctor);

// DELETE doctor
router.delete("/:id", doctorController.deleteDoctor);

export default router;
