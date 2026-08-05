import { Router } from "express";
import nurseController from "../controllers/nurseController";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createNurseSchema, updateNurseSchema, idParamSchema } from "../schemas";

const router = Router();

router.get("/", nurseController.getAllNurse);
router.get("/:id", validate(idParamSchema, "params"), nurseController.getNurseById);

// Escrita apenas para ADMIN
router.post("/", authorize("ADMIN"), validate(createNurseSchema), nurseController.createNurse);
router.put("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), validate(updateNurseSchema), nurseController.updateNurse);
router.delete("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), nurseController.deleteNurse);

export default router;
