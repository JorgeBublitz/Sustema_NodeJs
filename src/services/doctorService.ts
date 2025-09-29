import { WorkStatus } from './../generated/prisma/index.d';
import prisma from "../database/prismaClient";
import type { StateBR, Prisma, Department } from "../generated/prisma";

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

    async createDoctor(data: { userId: number; workStatus: WorkStatus; crmNumber: string; crmState: StateBR; specialty: string; department: Department }): Promise<DoctorWithRelations> {
        return prisma.doctor.create({
            data: {
                userId: data.userId,
                workStatus: data.workStatus,
                crmNumber: data.crmNumber,
                crmState: data.crmState,
                specialty: data.specialty,
                department: data.department
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
            crmState: StateBR,
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
