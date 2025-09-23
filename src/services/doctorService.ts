import prisma from "../database/prismaClient";
import type { EstadoBR, Prisma } from "../generated/prisma";

// Tipo com relacionamentos
export type DoctorWithRelations = Prisma.DoctorGetPayload<{
    include: { user: true; appointments: true }
}>;

const doctorService = {
    async getAllDoctors(): Promise<DoctorWithRelations[]> {
        return prisma.doctor.findMany({
            include: { user: true, appointments: true },
        });
    },

    async getDoctorById(id: number): Promise<DoctorWithRelations | null> {
        return prisma.doctor.findUnique({
            where: { id },
            include: { user: true, appointments: true },
        });
    },

    async createDoctor(data: { userId: number; crmNumber: string; crmState: EstadoBR; specialty: string }): Promise<DoctorWithRelations> {
        return prisma.doctor.create({
            data: {
                userId: data.userId,
                crmNumber: data.crmNumber,
                crmState: data.crmState,
                specialty: data.specialty
            },
            include: {
                user: true,
                appointments: true
            }
        });
    },

    async updateDoctorById(
        id: number,
        data: {
            crmNumber: string,
            crmState: EstadoBR,
            specialty: string
        }
    ): Promise<DoctorWithRelations> {
        return prisma.doctor.update({
            where: { id },
            data,
            include: { user: true, appointments: true },
        });
    },

    async deleteDoctor(id: number): Promise<DoctorWithRelations> {
        return prisma.doctor.delete({
            where: { id },
            include: { user: true, appointments: true },
        });
    },
};

export default doctorService;
