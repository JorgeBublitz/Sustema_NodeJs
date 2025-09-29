import prisma from "../database/prismaClient";
import type { Prisma } from "../generated/prisma";
import type { Shift, WorkStatus } from "../generated/prisma";

export type SecretaryWithRelations = Prisma.SecretaryGetPayload<{
    include: { user: true; appointments: true };
}>;

const secretaryService = {
    async getAllSecretaries(): Promise<SecretaryWithRelations[]> {
        return prisma.secretary.findMany({
            include: { user: true, appointments: true },
        });
    },

    async getSecretaryById(id: number): Promise<SecretaryWithRelations | null> {
        return prisma.secretary.findUnique({
            where: { id },
            include: { user: true, appointments: true },
        });
    },

    async createSecretary(data: {
        userId: number;
        shift: Shift;
        workStatus: WorkStatus;
    }): Promise<SecretaryWithRelations> {
        const secretary = await prisma.secretary.create({
            data: {
                userId: data.userId,
                shift: data.shift,
                workStatus: data.workStatus || "NOT_WORKING",
            },
            include: { user: true, appointments: true },
        });
        return secretary;
    },

    async updateSecretary(
        id: number,
        data: { shift?: Shift; workStatus?: WorkStatus }
    ): Promise<SecretaryWithRelations> {
        const secretary = await prisma.secretary.update({
            where: { id },
            data,
            include: { user: true, appointments: true },
        });
        return secretary;
    },

    async deleteSecretary(id: number): Promise<SecretaryWithRelations> {
        const secretary = await this.getSecretaryById(id);
        if (!secretary) throw new Error(`Secretary with ID ${id} not found.`);
        await prisma.secretary.delete({ where: { id } });
        return secretary;
    },
};

export default secretaryService;
