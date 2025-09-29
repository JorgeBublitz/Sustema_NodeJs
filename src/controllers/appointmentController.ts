import { Request, Response, NextFunction } from "express";
import appointmentService, { AppointmentWithRelations } from "../services/appointmentService";

const appointmentController = {
    async getAllAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const appointments: AppointmentWithRelations[] = await appointmentService.getAllAppointments();
            res.json(appointments);
        } catch (err) {
            next(err);
        }
    },

    async getAppointmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);

            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            const appointment = await appointmentService.getAppointmentById(id);

            if (!appointment) {
                res.status(404).json({ message: "Agendamento não encontrado." });
                return;
            }

            res.json(appointment);
        } catch (err) {
            next(err);
        }
    },

    async createAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { dateTime, doctorIds, patientId, nurseIds, secretaryId, notes } = req.body;

            // Passando arrays de IDs para médicos e enfermeiros
            const appointment = await appointmentService.createAppointment({
                dateTime: new Date(dateTime),
                doctorIds,
                patientId,
                nurseIds,
                secretaryId,
                notes,
            });

            res.status(201).json(appointment);
        } catch (err: any) {
            if (err.code === "P2003") {
                res.status(400).json({ message: "Doutor, paciente, enfermeiro ou secretário informado não existe." });
            } else {
                next(err);
            }
        }
    },

    async updateAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);

            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            const { dateTime, doctorIds, patientId, nurseIds, secretaryId, notes } = req.body;

            const appointment = await appointmentService.updateAppointmentById(id, {
                dateTime: dateTime ? new Date(dateTime) : undefined,
                doctorIds,
                patientId,
                nurseIds,
                secretaryId,
                notes,
            });

            res.json(appointment);
        } catch (err: any) {
            if (err.code === "P2025") {
                res.status(404).json({ message: "Agendamento não encontrado." });
            } else if (err.code === "P2003") {
                res.status(400).json({ message: "Doutor, paciente, enfermeiro ou secretário informado não existe." });
            } else {
                next(err);
            }
        }
    },

    async deleteAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);

            if (isNaN(id) || id <= 0) {
                res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
                return;
            }

            await appointmentService.deleteAppointment(id);
            res.status(204).send();
        } catch (err: any) {
            if (err.code === "P2025") {
                res.status(404).json({ message: "Agendamento não encontrado." });
            } else {
                next(err);
            }
        }
    },
};

export default appointmentController;
