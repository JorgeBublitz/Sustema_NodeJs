import { Request, Response, NextFunction } from "express";
import patientService, { PatientWithRelations } from "../services/patientService";
import { Condition, Room } from "../generated/prisma";

const patientController = {
    async getAllPatient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const patient: PatientWithRelations[] = await patientService.getAllPatients();
            res.json(patient);
        } catch (err) {
            next(err);
        }
    },

    async getPatientById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = parseInt(req.params.id, 10);

            if (isNaN(id) || id <= 0) {
                res.status(404).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            const patient: PatientWithRelations | null = await patientService.getPatientById(id);

            if (!patient) {
                res.status(404).json({ message: "Paciente não encontrado" })
                return;
            }

            res.json(patient);
        } catch (err) {
            next(err);
        }
    },

    async createPatient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let { name, email, phone, birthDate, condition, location } = req.body;

            // Converte data YYYY-MM-DD ou ISO para Date
            birthDate = new Date(birthDate);
            if (isNaN(birthDate.getTime())) {
                res.status(400).json({ message: "Data de nascimento inválida." });
                return;
            }

            const patient: PatientWithRelations = await patientService.createPatient({
                name,
                email,
                phone,
                birthDate,
                condition,
                location,
            });

            res.status(201).json(patient);
        } catch (err: any) {
            if (err.code === "P2002") {
                res.status(409).json({ message: "Já existe um paciente com este email." });
            } else if (err.code === "P2003") {
                res.status(400).json({ message: "Referência inválida (ex: paciente ou médico não existe)." });
            } else {
                next(err);
            }
        }
    },

    async updatePatient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            const { name, email, phone, birthDate, condition, location } = req.body;

            let parsedBirthDate: Date | undefined;
            if (birthDate) {
                parsedBirthDate = new Date(birthDate);
                if (isNaN(parsedBirthDate.getTime())) {
                    res.status(400).json({ message: "Data de nascimento inválida." });
                    return;
                }
            }

            if (condition && !Object.values(Condition).includes(condition)) {
                res.status(400).json({ message: "Condition inválido. Valores permitidos: SURGERY, REST, WAIT." });
                return;
            }

            if (location && !Object.values(Room).includes(location)) {
                res.status(400).json({ message: "Room inválido. Valores permitidos: PS, SURGERY, UTI, WARD." });
                return;
            }

            const patient = await patientService.updatePatientById(id, {
                name,
                email,
                phone,
                birthDate: parsedBirthDate,
                condition,
                location,
            });

            res.json(patient);
        } catch (err: any) {
            if (err.code === "P2025") {
                res.status(404).json({ message: "Paciente não encontrado." });
            } else if (err.code === "P2002") {
                res.status(409).json({ message: "Já existe um paciente com este email." });
            } else {
                next(err);
            }
        }
    },

    async deletePatient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            await patientService.deletePatient(id);
            res.status(204).send();
        } catch (err: any) {
            if (err.code === "P2025") {
                res.status(404).json({ message: "Paciente não encontrado." });
            } else {
                next(err);
            }
        }
    },
};

export default patientController;