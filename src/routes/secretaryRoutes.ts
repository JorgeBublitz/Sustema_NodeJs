import { Router } from "express";
import secretaryController from "../controllers/secretaryController";

const router = Router();

router.get("/", secretaryController.getAllSecretaries);
router.get("/:id", secretaryController.getSecretaryById);
router.post("/", secretaryController.createSecretary);
router.put("/:id", secretaryController.updateSecretary);
router.delete("/:id", secretaryController.deleteSecretary);

export default router;
