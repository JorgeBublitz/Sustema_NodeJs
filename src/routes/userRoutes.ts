import { Router } from "express";
import userController from "../controllers/userController";

const router = Router();

// GET all users
router.get("/", userController.getAllUsers);

// GET user by ID
router.get("/:id", userController.getUserById);

// POST create user
router.post("/", userController.createUser);

// PUT update user
router.put("/:id", userController.updateUser);

// DELETE user
router.delete("/:id", userController.deleteUser);

export default router;
