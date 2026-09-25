import prisma from "../database/prismaClient";
import type { StateBR, Prisma, WorkStatus, NurseLevel, Department } from "../generated/prisma";
import { HttpError } from "../utils/http-error";

export type NurseWithRelations = Prisma.NurseGetPayload<{
    include: { user: true; appointments: { include: { appointment: true } } }
}>;

const nurseService = {
    async getAllNurses(): Promise<NurseWithRelations[]> {
        return prisma.nurse.findMany({
            include: { user: true, appointments: { include: { appointment: true } } },
        });
    },

    async getNurseById(id: number): Promise<NurseWithRelations | null> {
        return prisma.nurse.findUnique({
            where: { id },
            include: { user: true, appointments: { include: { appointment: true } } },
        });
    },

    async createNurse(data: { userId: number, workStatus: WorkStatus, corenNumber: string, corenState: StateBR, level: NurseLevel, department: Department, experience: number, specialization: string }): Promise<NurseWithRelations> {
        const user = await prisma.user.findUnique({ where: { id: data.userId } });
        if (!user) {
            throw new HttpError(400, "Usuário não encontrado.");
        }
        if (user.role !== "NURSE") {
            throw new HttpError(400, "O usuário informado não possui o cargo (role) de NURSE.");
        }

        const existingNurse = await prisma.nurse.findUnique({ where: { userId: data.userId } });
        if (existingNurse) {
            throw new HttpError(409, "Já existe um registro de enfermeiro para este usuário.");
        }

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
            include: { user: true, appointments: { include: { appointment: true } } },
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
            include: { user: true, appointments: { include: { appointment: true } } },
        });
    },

    async deleteNurse(id: number): Promise<NurseWithRelations> {
        return prisma.nurse.delete({
            where: { id },
            include: { user: true, appointments: { include: { appointment: true } } },
        });
    },
};

export default nurseService;
