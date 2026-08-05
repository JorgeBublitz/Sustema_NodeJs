import { Router } from "express";
import secretaryController from "../controllers/secretaryController";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createSecretarySchema, updateSecretarySchema, idParamSchema } from "../schemas";

const router = Router();

router.get("/", secretaryController.getAll);
router.get("/:id", validate(idParamSchema, "params"), secretaryController.getById);

// Escrita apenas para ADMIN
router.post("/", authorize("ADMIN"), validate(createSecretarySchema), secretaryController.create);
router.put("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), validate(updateSecretarySchema), secretaryController.update);
router.delete("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), secretaryController.delete);

export default router;
