import { Router } from "express";
import doctorController from "../controllers/doctorController";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createDoctorSchema, updateDoctorSchema, idParamSchema } from "../schemas";

const router = Router();

router.get("/", doctorController.getAllDoctors);
router.get("/:id", validate(idParamSchema, "params"), doctorController.getDoctorById);

// Escrita apenas para ADMIN
router.post("/", authorize("ADMIN"), validate(createDoctorSchema), doctorController.createDoctor);
router.put("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), validate(updateDoctorSchema), doctorController.updateDoctor);
router.delete("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), doctorController.deleteDoctor);

export default router;
