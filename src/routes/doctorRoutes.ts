import { Router } from "express";
import doctorController from "../controllers/doctorController";
import { authorize } from "../middlewares/auth";

const router = Router();

router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);

// Escrita apenas para ADMIN
router.post("/", authorize("ADMIN"), doctorController.createDoctor);
router.put("/:id", authorize("ADMIN"), doctorController.updateDoctor);
router.delete("/:id", authorize("ADMIN"), doctorController.deleteDoctor);

export default router;
