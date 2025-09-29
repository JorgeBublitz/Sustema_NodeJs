import { Request, Response, NextFunction } from "express";
import secretaryService, { SecretaryWithRelations } from "../services/secretaryService";

const secretaryController = {
    async getAllSecretaries(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const secretaries: SecretaryWithRelations[] = await secretaryService.getAllSecretaries();
            res.json(secretaries);
        } catch (err) {
            next(err);
        }
    },

    async getSecretaryById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido." });
                return;
            }

            const secretary = await secretaryService.getSecretaryById(id);
            if (!secretary) {
                res.status(404).json({ message: "Secretário não encontrado." });
                return;
            }

            res.json(secretary);
        } catch (err) {
            next(err);
        }
    },

    async createSecretary(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, shift, workStatus } = req.body;

            const secretary = await secretaryService.createSecretary({
                userId,
                shift,
                workStatus,
            });

            res.status(201).json(secretary);
        } catch (err: any) {
            if (err.code === "P2003") {
                res.status(400).json({ message: "Usuário informado não existe." });
            } else {
                next(err);
            }
        }
    },

    async updateSecretary(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido." });
                return;
            }

            const { shift, workStatus } = req.body;

            const secretary = await secretaryService.updateSecretary(id, { shift, workStatus });
            res.json(secretary);
        } catch (err: any) {
            if (err.code === "P2025") {
                res.status(404).json({ message: "Secretário não encontrado." });
            } else {
                next(err);
            }
        }
    },

    async deleteSecretary(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido." });
                return;
            }

            await secretaryService.deleteSecretary(id);
            res.status(204).send();
        } catch (err: any) {
            if (err.code === "P2025") {
                res.status(404).json({ message: "Secretário não encontrado." });
            } else {
                next(err);
            }
        }
    },
};

export default secretaryController;
