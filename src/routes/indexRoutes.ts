import { Router } from "express";
import userRoutes from "./userRoutes";
import doctorRoutes from "./doctorRoutes";
import pacientRoutes from "./pacientRoutes";
import appointmentRoutes from "./appointmentRoutes";
import nurseRoutes from "./nurseRoutes";

const router = Router();

router.use("/u", userRoutes);
router.use("/d", doctorRoutes);
router.use("/p", pacientRoutes);
router.use("/a", appointmentRoutes);
router.use("/n", nurseRoutes);

export default router;
