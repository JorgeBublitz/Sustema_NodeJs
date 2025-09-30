import { Router } from "express";
import userRoutes from "./userRoutes";
import doctorRoutes from "./doctorRoutes";
import pacientRoutes from "./pacientRoutes";
import appointmentRoutes from "./appointmentRoutes";
import nurseRoutes from "./nurseRoutes";
import secretaryRoutes from "./secretaryRoutes";

const router = Router();

router.use("/user", userRoutes);
router.use("/doctor", doctorRoutes);
router.use("/pacient", pacientRoutes);
router.use("/appointment", appointmentRoutes);
router.use("/nurse", nurseRoutes);
router.use("/secretary", secretaryRoutes);

export default router;
