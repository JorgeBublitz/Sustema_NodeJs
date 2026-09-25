import { Router } from "express";
import userController from "../controllers/userController";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createUserSchema, updateUserSchema, idParamSchema } from "../schemas";

const router = Router();

// Gerenciamento de usuários é exclusivo do ADMIN
router.get("/", authorize("ADMIN"), userController.getAll);
router.get("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), userController.getById);
router.post("/", authorize("ADMIN"), validate(createUserSchema), userController.create);
router.put("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), validate(updateUserSchema), userController.update);
router.delete("/:id", authorize("ADMIN"), validate(idParamSchema, "params"), userController.delete);

export default router;
