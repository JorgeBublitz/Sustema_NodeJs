import prisma from "../database/prismaClient";
import type { Prisma } from "../generated/prisma";

// Tipo com relacionamentos
export type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
    include: {
        doctor: { include: { user: true } };
        patient: true;
    };
}>;

const appointmentService = {
    async getAllAppointments(): Promise<AppointmentWithRelations[]> {
        return prisma.appointment.findMany({
            include: {
                doctor: { include: { user: true } },
                patient: true,
            },
        });
    },

    async getAppointmentById(id: number): Promise<AppointmentWithRelations | null> {
        return prisma.appointment.findUnique({
            where: { id },
            include: {
                doctor: { include: { user: true } },
                patient: true,
            },
        });
    },

    async createAppointment(data: {
        dateTime: Date;
        doctorId: number;
        patientId: number;
        notes?: string;
    }): Promise<AppointmentWithRelations> {
        return prisma.appointment.create({
            data: {
                dateTime: data.dateTime,
                doctorId: data.doctorId,
                patientId: data.patientId,
                notes: data.notes,
            },
            include: {
                doctor: { include: { user: true } },
                patient: true,
            },
        });
    },

    async updateAppointmentById(
        id: number,
        data: {
            dateTime?: Date;
            doctorId?: number;
            patientId?: number;
            notes?: string;
        }
    ): Promise<AppointmentWithRelations> {
        return prisma.appointment.update({
            where: { id },
            data,
            include: {
                doctor: { include: { user: true } },
                patient: true,
            },
        });
    },

    async deleteAppointment(id: number): Promise<AppointmentWithRelations> {
        return prisma.appointment.delete({
            where: { id },
            include: {
                doctor: { include: { user: true } },
                patient: true,
            },
        });
    },
};

export default appointmentService;
