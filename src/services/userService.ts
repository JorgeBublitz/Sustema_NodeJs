import prisma from "../database/prismaClient";
import type { Prisma, Role, EstadoBR } from "../generated/prisma";
import bcrypt from "bcrypt";

export type UserWithRelations = Prisma.UserGetPayload<{
    include: { doctor: true; nurse: true }
}>;

const SALT_ROUNDS = 10;

const userService = {
    async getAllUsers(): Promise<UserWithRelations[]> {
        return prisma.user.findMany({
            include: { doctor: true, nurse: true },
        });
    },

    async getUserById(id: number): Promise<UserWithRelations | null> {
        return prisma.user.findUnique({
            where: { id },
            include: { doctor: true, nurse: true },
        });
    },

    async createUser(data: { name: string; email: string; passwordHash: string; role: Role }): Promise<UserWithRelations> {
        const hashedPassword = await bcrypt.hash(data.passwordHash, SALT_ROUNDS);
        const role = data.role.toUpperCase() as Role;

        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: { ...data, passwordHash: hashedPassword, role },
            });

            if (role === "DOCTOR") {
                await tx.doctor.create({ data: { userId: newUser.id, crmNumber: "", crmState: "PB", specialty: "" } });
            } else if (role === "NURSE") {
                await tx.nurse.create({ data: { userId: newUser.id, corenNumber: "", corenState: "PB" } });
            }

            return newUser;
        });

        return prisma.user.findUnique({
            where: { id: user.id },
            include: { doctor: true, nurse: true },
        }) as Promise<UserWithRelations>;
    },

    async updateUserById(
        id: number,
        data: {
            name?: string;
            email?: string;
            passwordHash?: string;
            role?: Role;
            doctorData?: {
                crmNumber: string;
                crmState: EstadoBR;
                specialty: string;
            };
            nurseData?: {
                corenNumber: string;
                corenState: EstadoBR;
            };
        }
    ): Promise<UserWithRelations> {
        const role = data.role?.toUpperCase() as Role | undefined;

        const user = await prisma.$transaction(async (tx) => {
            // Buscar usuário atual com relacionamentos
            const userBeforeUpdate = await tx.user.findUnique({
                where: { id },
                include: { doctor: true, nurse: true },
            });

            if (!userBeforeUpdate) throw new Error("User not found");

            const updateData: any = { ...data };

            // Hash da senha se for passada
            if (data.passwordHash) {
                updateData.passwordHash = await bcrypt.hash(data.passwordHash, SALT_ROUNDS);
            }

            // Atualiza o usuário
            const updatedUser = await tx.user.update({
                where: { id },
                data: role ? { ...updateData, role } : updateData,
            });

            // Remove relacionamentos antigos
            if (userBeforeUpdate.doctor) await tx.doctor.delete({ where: { id: userBeforeUpdate.doctor.id } });
            if (userBeforeUpdate.nurse) await tx.nurse.delete({ where: { id: userBeforeUpdate.nurse.id } });

            // Cria novo relacionamento baseado no role
            if (role === "DOCTOR") {
                await tx.doctor.create({
                    data: {
                        userId: updatedUser.id,
                        ...(data.doctorData || { crmNumber: "", crmState: "PB", specialty: "" }),
                    },
                });
            } else if (role === "NURSE") {
                await tx.nurse.create({
                    data: {
                        userId: updatedUser.id,
                        ...(data.nurseData || { corenNumber: "", corenState: "PB" }),
                    },
                });
            }

            return updatedUser;
        });

        // Retorna usuário atualizado com relacionamentos
        return prisma.user.findUnique({
            where: { id: user.id },
            include: { doctor: true, nurse: true },
        }) as Promise<UserWithRelations>;
    },


    async deleteUser(id: number): Promise<UserWithRelations> {
        return prisma.user.delete({
            where: { id }, 
            include: { doctor: true, nurse: true },
        });
    },

    async checkPassword(email: string, passwordHash: string): Promise<UserWithRelations | null> {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { doctor: true, nurse: true },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(passwordHash, user.passwordHash);
        return isValid ? user : null;
    },
};

export default userService;
