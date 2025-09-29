import prisma from "../database/prismaClient";
import { type Prisma, type Role, type StateBR, type Gender, Department, NurseLevel, WorkStatus } from "../generated/prisma";
import bcrypt from "bcrypt";

export type UserWithRelations = Prisma.UserGetPayload<{
  include: { doctor: true; nurse: true };
}>;

const SALT_ROUNDS = 10;

const userService = {
  // Buscar todos usuários
  async getAllUsers(): Promise<UserWithRelations[]> {
    return prisma.user.findMany({
      include: { doctor: true, nurse: true },
    });
  },

  // Buscar usuário por ID
  async getUserById(id: number): Promise<UserWithRelations | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { doctor: true, nurse: true },
    });
  },

  // Criar usuário com hash de senha
  async createUser(data: {
    name: string;
    age: number;
    gender: Gender;
    email: string;
    password: string;
    role: Role
  }): Promise<UserWithRelations> {
    if (!data.password || typeof data.password !== "string") {
      throw new Error("Senha é obrigatória e deve ser uma string");
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: data.name,
          age: data.age,
          gender: data.gender,
          email: data.email,
          password: passwordHash,
          role: data.role,
        },
      });

      // Cria Doctor ou Nurse conforme role
      if (data.role === "DOCTOR") {
        await tx.doctor.create({
          data: {
            userId: newUser.id,
            crmNumber: "TEMP",
            crmState: "PB",
            specialty: "General",
            department: "EMERGENCY",
          },
        });
      } else if (data.role === "NURSE") {
        await tx.nurse.create({
          data: {
            userId: newUser.id,
            corenNumber: "TEMP",
            corenState: "PB",
            level: "ASSISTANT",
            department: "WARD",
            experience: 0,
          },
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
      age?: number;
      gender?: Gender;
      email?: string;
      password?: string;
      role?: Role;
      doctorData?: { crmNumber: string; crmState: StateBR; specialty: string; department: Department; workStatus: WorkStatus };
      nurseData?: { corenNumber: string; corenState: StateBR; level: NurseLevel; department: Department; experience: number; workState: WorkStatus };
    }
  ): Promise<UserWithRelations> {
    const user = await prisma.$transaction(async (tx) => {
      const userBeforeUpdate = await tx.user.findUnique({
        where: { id },
        include: { doctor: true, nurse: true },
      });

      if (!userBeforeUpdate) throw new Error("Usuário não encontrado");

      const updateData: any = { ...data };

      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
      }

      delete updateData.doctorData;
      delete updateData.nurseData;

      const updatedUser = await tx.user.update({
        where: { id },
        data: updateData,
      });

      // Atualiza Doctor se existir
      if (data.role === "DOCTOR" && data.doctorData) {
        if (userBeforeUpdate.doctor) {
          await tx.doctor.update({
            where: { id: userBeforeUpdate.doctor.id },
            data: data.doctorData,
          });
        } else {
          await tx.doctor.create({ data: { userId: updatedUser.id, ...data.doctorData } });
        }
      }

      // Atualiza Nurse se existir
      if (data.role === "NURSE" && data.nurseData) {
        if (userBeforeUpdate.nurse) {
          await tx.nurse.update({
            where: { id: userBeforeUpdate.nurse.id },
            data: data.nurseData,
          });
        } else {
          await tx.nurse.create({ data: { userId: updatedUser.id, ...data.nurseData } });
        }
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

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  },
};

export default userService;
