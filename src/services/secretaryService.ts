import prisma from "../database/prismaClient";
import type { Prisma } from "../generated/prisma";
import type { Shift, WorkStatus } from "../generated/prisma";
import { HttpError } from "../utils/http-error";

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
        const user = await prisma.user.findUnique({ where: { id: data.userId } });
        if (!user) {
            throw new HttpError(400, "Usuário não encontrado.");
        }
        if (user.role !== "SECRETARY") {
            throw new HttpError(400, "O usuário informado não possui o cargo (role) de SECRETARY.");
        }

        const existingSecretary = await prisma.secretary.findUnique({ where: { userId: data.userId } });
        if (existingSecretary) {
            throw new HttpError(409, "Já existe um registro de secretário para este usuário.");
        }

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
        return prisma.secretary.delete({
            where: { id },
            include: { user: true, appointments: true },
        });
    },
};

export default secretaryService;
