import { Router } from "express";
import userController from "../controllers/userController";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createUserSchema, updateUserSchema, idParamSchema } from "../schemas";

const router = Router();

// Gerenciamento de usuários é exclusivo do ADMIN
router.use(authorize("ADMIN"));

router.get("/", userController.getAll);
router.get("/:id", validate(idParamSchema, "params"), userController.getById);
router.post("/", validate(createUserSchema), userController.create);
router.put("/:id", validate(idParamSchema, "params"), validate(updateUserSchema), userController.update);
router.delete("/:id", validate(idParamSchema, "params"), userController.delete);

export default router;
