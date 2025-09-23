import prisma from "../database/prismaClient";
import type { Prisma, Role } from "../generated/prisma";
import bcrypt from "bcrypt"

// Tipo do usuário com relações
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

    async createUser(data: { name: string; email: string; password: string; role: Role }): Promise<UserWithRelations> {
        // Hash da senha
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        // Cria o usuário
        const user = await prisma.user.create({
            data: { ...data, password: hashedPassword },
            include: { doctor: true, nurse: true },
        });

        // Cria o registro correspondente se DOCTOR ou NURSE
        if (data.role === "DOCTOR") {
            await prisma.doctor.create({
                data: {
                    userId: user.id,
                    crmNumber: "",     // preencher depois
                    crmState: "PB",    // padrão ou alterar
                    specialty: "",     // preencher depois
                },
            });
        }

        if (data.role === "NURSE") {
            await prisma.nurse.create({
                data: {
                    userId: user.id,
                    corenNumber: "",
                    corenState: "PB"
                },
            });
        }

        return prisma.user.findUnique({
            where: { id: user.id },
            include: { doctor: true, nurse: true },
        }) as Promise<UserWithRelations>;
    },

    async updateUserById(
        id: number,
        data: { name?: string; email?: string; password?: string; role?: Role }
    ): Promise<UserWithRelations> {
        const updateData: any = { ...data };

        // Se senha foi passada, faz hash
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            include: { doctor: true, nurse: true },
        });

        // Se mudou a role, criar ou remover registros correspondentes
        if (data.role && data.role !== user.role) {
            if (data.role === "DOCTOR" && !user.doctor) {
                await prisma.doctor.create({
                    data: { userId: user.id, crmNumber: "", crmState: "SP", specialty: "" },
                });
            }
            // if (data.role === "NURSE" && !user.nurse) {
            //     await prisma.nurse.create({ data: { id: user. } });
            // }
            if (data.role !== "DOCTOR" && user.doctor) {
                await prisma.doctor.delete({ where: { id: user.doctor.id } });
            }
            if (data.role !== "NURSE" && user.nurse) {
                await prisma.nurse.delete({ where: { id: user.nurse.id } });
            }
        }

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

    // Método adicional: verificar senha
    async checkPassword(email: string, password: string): Promise<UserWithRelations | null> {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { doctor: true, nurse: true },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        return isValid ? user : null;
    },
};

export default userService;
