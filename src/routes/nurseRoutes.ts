import { Router } from "express";
import nurseController from "../controllers/nurseController"

const router = Router();

router.get("/", nurseController.getAllNurse);
router.get("/:id", nurseController.getNurseById);
router.post("/", nurseController.createNurse);
router.put("/:id", nurseController.updateNurse);
router.delete("/:id", nurseController.deleteNurse);

export default router;

