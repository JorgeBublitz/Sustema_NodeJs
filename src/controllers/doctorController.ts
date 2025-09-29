import { Request, Response, NextFunction } from "express";
import doctorService, { DoctorWithRelations } from "../services/doctorService";

const doctorController = {
    async getAllDoctors(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const doctors: DoctorWithRelations[] = await doctorService.getAllDoctors();
            res.json(doctors);
        } catch (err) {
            next(err);
        }
    },

    async getDoctorById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = parseInt(req.params.id, 10);

            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            const doctor: DoctorWithRelations | null = await doctorService.getDoctorById(id);

            if (!doctor) {
                res.status(404).json({ message: "Médico não encontrado." });
                return;
            }

            res.json(doctor);
        } catch (err) {
            next(err);
        }
    },

    async createDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, workStatus, crmNumber, crmState, specialty, department } = req.body;

            const doctor: DoctorWithRelations = await doctorService.createDoctor({
                userId,
                workStatus,
                crmNumber,
                crmState,
                specialty,
                department
            });

            res.status(201).json(doctor);
        } catch (err: any) {
            if (err.code === "P2002") {
                res.status(409).json({ message: "Já existe um médico com este CRM." });
            } else if (err.code === "P2003") {
                res.status(400).json({ message: "Usuário não encontrado para o userId fornecido." });
            } else {
                next(err);
            }
        }
    },

    async updateDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = parseInt(req.params.id, 10);

            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            const { crmNumber, crmState, specialty } = req.body;

            const doctor: DoctorWithRelations = await doctorService.updateDoctorById(id, { crmNumber, crmState, specialty });
            res.json(doctor);
        } catch (err: any) {
            if (err.code === "P2025") {
                res.status(404).json({ message: "Médico não encontrado." });
            } else {
                next(err);
            }
        }
    },

    async deleteDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = parseInt(req.params.id, 10);

            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            await doctorService.deleteDoctor(id);
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

export default doctorController;
