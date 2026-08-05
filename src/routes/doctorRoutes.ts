import { Router } from "express";
import doctorController from "../controllers/doctorController";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createDoctorSchema, updateDoctorSchema, idParamSchema } from "../schemas";

const router = Router();

router.get("/", doctorController.getAll);
router.get("/:id", validate(idParamSchema, "params"), doctorController.getById);

// Escrita apenas para ADMIN
router.post("/", authorize("ADMIN"), validate(createDoctorSchema), doctorController.create);
router.put("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), validate(updateDoctorSchema), doctorController.update);
router.delete("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), doctorController.delete);

export default router;
