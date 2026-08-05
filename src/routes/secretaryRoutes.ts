import { Router } from "express";
import secretaryController from "../controllers/secretaryController";
import { authorize } from "../middlewares/auth";

const router = Router();

router.get("/", secretaryController.getAllSecretaries);
router.get("/:id", secretaryController.getSecretaryById);

// Escrita apenas para ADMIN
router.post("/", authorize("ADMIN"), secretaryController.createSecretary);
router.put("/:id", authorize("ADMIN"), secretaryController.updateSecretary);
router.delete("/:id", authorize("ADMIN"), secretaryController.deleteSecretary);

export default router;
