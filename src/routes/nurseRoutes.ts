import { Router } from "express";
import nurseController from "../controllers/nurseController"
import { authorize } from "../middlewares/auth";

const router = Router();

router.get("/", nurseController.getAllNurse);
router.get("/:id", nurseController.getNurseById);

// Escrita apenas para ADMIN
router.post("/", authorize("ADMIN"), nurseController.createNurse);
router.put("/:id", authorize("ADMIN"), nurseController.updateNurse);
router.delete("/:id", authorize("ADMIN"), nurseController.deleteNurse);

export default router;

