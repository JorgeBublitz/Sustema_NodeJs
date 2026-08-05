import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import doctorRoutes from "./doctorRoutes";
import pacientRoutes from "./pacientRoutes";
import appointmentRoutes from "./appointmentRoutes";
import nurseRoutes from "./nurseRoutes";
import secretaryRoutes from "./secretaryRoutes";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Rotas públicas
router.use("/auth", authRoutes);

// Demais rotas exigem autenticação
router.use(authenticate);

router.use("/user", userRoutes);
router.use("/doctor", doctorRoutes);
router.use("/pacient", pacientRoutes);
router.use("/appointment", appointmentRoutes);
router.use("/nurse", nurseRoutes);
router.use("/secretary", secretaryRoutes);

export default router;
