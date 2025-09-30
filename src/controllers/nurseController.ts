import { WorkStatus } from './../generated/prisma/index.d';
import { Request, Response, NextFunction } from "express";
import nurseService, { NurseWithRelations } from "../services/nurseService";

const nurseController = {
    async getAllNurse(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const nurses: NurseWithRelations[] = await nurseService.getAllNurses();
            res.json(nurses);
        } catch (err) {
            next(err);
        }
    },

    async getNurseById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = parseInt(req.params.id, 10);

            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            const nurse: NurseWithRelations | null = await nurseService.getNurseById(id);

            if (!nurse) {
                res.status(404).json({ message: "Enfermeiro(a) não encontrado." });
                return;
            }

            res.json(nurse);
        } catch (err) {
            next(err);
        }
    },

    async createNurse(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, workStatus, corenNumber, corenState, level, department, experience, specialization } = req.body;

            const nurse: NurseWithRelations = await nurseService.createNurse({
                userId,
                workStatus,
                corenNumber,
                corenState,
                level,
                department,
                experience,
                specialization,
            });

            res.status(201).json(nurse);
        } catch (err: any) {
            if (err.code === "P2002") {
                res.status(409).json({ message: "Já existe um enfermeiro com este CRM." });
            } else if (err.code === "P2003") {
                res.status(400).json({ message: "Usuário não encontrado para o userId fornecido." });
            } else {
                next(err);
            }
        }
    },

    async updateNurse(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = parseInt(req.params.id, 10);

            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            const { corenNumber, corenState, workStatus, level, department, experience, specialization } = req.body;

            const nurse: NurseWithRelations = await nurseService.updateNurseById(id, { corenNumber, corenState, workStatus, level, department, experience, specialization });
            res.json(nurse);
        } catch (err: any) {
            if (err.code === "P2025") {
                res.status(404).json({ message: "Médico não encontrado." });
            } else {
                next(err);
            }
        }
    },

    async deleteNurse(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = parseInt(req.params.id, 10);

            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            await nurseService.deleteNurse(id);
            res.status(204).send();
        } catch (err: any) {
            if (err.code === "P2025") {
                res.status(404).json({ message: "Médico não encontrado." });
            } else {
                next(err);
            }
        }
    },
};

export default nurseController;