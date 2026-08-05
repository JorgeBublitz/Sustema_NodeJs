import { Router } from "express";
import nurseController from "../controllers/nurseController";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createNurseSchema, updateNurseSchema, idParamSchema } from "../schemas";

const router = Router();

router.get("/", nurseController.getAll);
router.get("/:id", validate(idParamSchema, "params"), nurseController.getById);

// Escrita apenas para ADMIN
router.post("/", authorize("ADMIN"), validate(createNurseSchema), nurseController.create);
router.put("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), validate(updateNurseSchema), nurseController.update);
router.delete("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), nurseController.delete);

export default router;
