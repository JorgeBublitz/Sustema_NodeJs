import { Router } from "express";
import secretaryController from "../controllers/secretaryController";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createSecretarySchema, updateSecretarySchema, idParamSchema } from "../schemas";

const router = Router();

router.get("/", secretaryController.getAllSecretaries);
router.get("/:id", validate(idParamSchema, "params"), secretaryController.getSecretaryById);

// Escrita apenas para ADMIN
router.post("/", authorize("ADMIN"), validate(createSecretarySchema), secretaryController.createSecretary);
router.put("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), validate(updateSecretarySchema), secretaryController.updateSecretary);
router.delete("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), secretaryController.deleteSecretary);

export default router;
