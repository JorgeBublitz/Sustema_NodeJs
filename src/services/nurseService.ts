import prisma from "../database/prismaClient";
import type { StateBR, Prisma, WorkStatus, NurseLevel, Department } from "../generated/prisma";

export type NurseWithRelations = Prisma.NurseGetPayload<{
    include: { user: true; appointments: true }
}>;

const nurseService = {
    async getAllNurses(): Promise<NurseWithRelations[]> {
        return prisma.nurse.findMany({
            include: { user: true, appointments: true },
        });
    },

    async getNurseById(id: number): Promise<NurseWithRelations | null> {
        return prisma.nurse.findUnique({
            where: { id },
            include: { user: true, appointments: true },
        });
    },

    async createNurse(data: { userId: number, workStatus: WorkStatus, corenNumber: string, corenState: StateBR, level: NurseLevel, department: Department, experience: number, specialization: string }): Promise<NurseWithRelations> {
        return prisma.nurse.create({
            data: {
                userId: data.userId,
                workStatus: data.workStatus,
                corenNumber: data.corenNumber,
                corenState: data.corenState,
                level: data.level,
                department: data.department,
                experience: data.experience,
                specialization: data.specialization,
            },
            include: { user: true, appointments: true },
        });
    },

    async updateNurseById(
        id: number,
        data: {
            workStatus?: WorkStatus,
            corenNumber?: string,
            corenState?: StateBR,
            level?: NurseLevel,
            department?: Department,
            experience?: number,
            specialization?: string
        }
    ): Promise<NurseWithRelations> {
        return prisma.nurse.update({
            where: { id },
            data,
            include: { user: true, appointments: true },
        });
    },

    async deleteNurse(id: number): Promise<NurseWithRelations> {
        return prisma.nurse.delete({
            where: { id },
            include: { user: true, appointments: true },
        });
    },
};

export default nurseService;
