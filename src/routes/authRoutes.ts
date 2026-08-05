import { Router } from "express";
import authController from "../controllers/authController";
import { authenticate } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { loginSchema } from "../schemas";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authenticate, authController.me);

export default router;
