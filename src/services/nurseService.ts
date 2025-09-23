import prisma from "../database/prismaClient";
import type { EstadoBR, Prisma } from "../generated/prisma";

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

    async createNurse(data: { userId: number, corenNumber: string, corenState: EstadoBR }): Promise<NurseWithRelations> {
        return prisma.nurse.create({
            data: {
                userId: data.userId,
                corenNumber: data.corenNumber,
                corenState: data.corenState,
            },
            include: { user: true, appointments: true },
        });
    },

    async updateNurseById(
        id: number,
        data: {
            corenNumber: string,
            corenState: EstadoBR
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
