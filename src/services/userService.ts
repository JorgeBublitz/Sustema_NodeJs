import prisma from "../database/prismaClient";
import type { Prisma, Role, EstadoBR } from "../generated/prisma";
import bcrypt from "bcrypt";

export type UserWithRelations = Prisma.UserGetPayload<{
  include: { doctor: true; nurse: true };
}>;

const SALT_ROUNDS = 10;

const userService = {
  // Pegar todos os usuários
  async getAllUsers(): Promise<UserWithRelations[]> {
    return prisma.user.findMany({
      include: { doctor: true, nurse: true },
    });
  },

  // Pegar usuário por ID
  async getUserById(id: number): Promise<UserWithRelations | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { doctor: true, nurse: true },
    });
  },

  // Criar usuário
  async createUser(data: { name: string; email: string; password: string; role: Role }): Promise<UserWithRelations> {
    if (!data.password || typeof data.password !== "string") {
      throw new Error("Senha é obrigatória e deve ser uma string");
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const role = data.role.toUpperCase() as Role;

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: hashedPassword, // salva o hash
          role,
        },
      });

      if (role === "DOCTOR") {
        await tx.doctor.create({
          data: { userId: newUser.id, crmNumber: "", crmState: "PB", specialty: "" },
        });
      } else if (role === "NURSE") {
        await tx.nurse.create({
          data: { userId: newUser.id, corenNumber: "", corenState: "PB" },
        });
      }

      return newUser;
    });

    return prisma.user.findUnique({
      where: { id: user.id },
      include: { doctor: true, nurse: true },
    }) as Promise<UserWithRelations>;
  },

  // Atualizar usuário
  async updateUserById(
    id: number,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: Role;
      doctorData?: { crmNumber: string; crmState: EstadoBR; specialty: string };
      nurseData?: { corenNumber: string; corenState: EstadoBR };
    }
  ): Promise<UserWithRelations> {
    const role = data.role?.toUpperCase() as Role | undefined;

    const user = await prisma.$transaction(async (tx) => {
      const userBeforeUpdate = await tx.user.findUnique({
        where: { id },
        include: { doctor: true, nurse: true },
      });

      if (!userBeforeUpdate) throw new Error("Usuário não encontrado");

      const updateData: any = { ...data };

      // Se houver senha nova, gera hash
      if (data.password) {
        updateData.passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
      }

      // Remove o campo password antes de atualizar, Prisma não conhece
      delete updateData.password;

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

    return prisma.user.findUnique({
      where: { id: user.id },
      include: { doctor: true, nurse: true },
    }) as Promise<UserWithRelations>;
  },

  // Deletar usuário
  async deleteUser(id: number): Promise<UserWithRelations> {
    return prisma.user.delete({
      where: { id },
      include: { doctor: true, nurse: true },
    });
  },

  // Verificar senha
  async checkPassword(email: string, password: string): Promise<UserWithRelations | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { doctor: true, nurse: true },
    });

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  },
};

export default userService;
