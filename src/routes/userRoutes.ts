import { Router } from "express";
import userController from "../controllers/userController";
import { authorize } from "../middlewares/auth";

const router = Router();

// Gerenciamento de usuários é exclusivo do ADMIN
router.use(authorize("ADMIN"));

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
