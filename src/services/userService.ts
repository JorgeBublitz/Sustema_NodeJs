import { Shift } from './../generated/prisma/index.d';
import prisma from "../database/prismaClient";
import { type Prisma, type Role, type StateBR, type Gender, Department, NurseLevel, WorkStatus } from "../generated/prisma";
import bcrypt from "bcrypt";

export type UserWithRelations = Prisma.UserGetPayload<{
  include: { doctor: true; nurse: true, secretary: true };
}>;

const SALT_ROUNDS = 10;

const userService = {
  // Buscar todos usuários
  async getAllUsers(): Promise<UserWithRelations[]> {
    return prisma.user.findMany({
      include: { doctor: true, nurse: true, secretary: true },
    });
  },

  // Buscar usuário por ID
  async getUserById(id: number): Promise<UserWithRelations | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { doctor: true, nurse: true, secretary: true },
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
            workStatus: "NOT_WORKING",
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
            workStatus: "NOT_WORKING",
            corenNumber: "TEMP",
            corenState: "PB",
            level: "ASSISTANT",
            department: "WARD",
            experience: 0,
          },
        });
      } else if (data.role === "SECRETARY") {
        await tx.secretary.create({
          data: {
            userId: newUser.id,
            workStatus: "NOT_WORKING",
            shift: "MORNING",
          },
        });
      }

      return newUser;
    });

    return prisma.user.findUnique({
      where: { id: user.id },
      include: { doctor: true, nurse: true, secretary: true },
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
      nurseData?: { corenNumber: string; corenState: StateBR; level: NurseLevel; department: Department; experience: number; workStatus: WorkStatus };
      secretaryData?: { workStatus: WorkStatus, shift: Shift };
    }
  ): Promise<UserWithRelations> {
    const user = await prisma.$transaction(async (tx) => {
      const userBeforeUpdate = await tx.user.findUnique({
        where: { id },
        include: { doctor: true, nurse: true, secretary: true },
      });

      if (!userBeforeUpdate) throw new Error("Usuário não encontrado");

      const updateData: any = { ...data };

      // Se tem senha nova → gera hash
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
      }

      // remove dados extras para não passar pro update de user
      delete updateData.doctorData;
      delete updateData.nurseData;
      delete updateData.secretaryData;

      const updatedUser = await tx.user.update({
        where: { id },
        data: updateData,
      });

      // 🔥 Se mudou o role, limpa as entidades antigas
      if (data.role && data.role !== userBeforeUpdate.role) {
        if (userBeforeUpdate.doctor) {
          await tx.doctor.delete({ where: { id: userBeforeUpdate.doctor.id } });
        }
        if (userBeforeUpdate.nurse) {
          await tx.nurse.delete({ where: { id: userBeforeUpdate.nurse.id } });
        }
        if (userBeforeUpdate.secretary) {
          await tx.secretary.delete({ where: { id: userBeforeUpdate.secretary.id } });
        }
      }

      // Cria/atualiza conforme o role atual
      if (data.role === "DOCTOR") {
        if (userBeforeUpdate.doctor) {
          await tx.doctor.update({
            where: { id: userBeforeUpdate.doctor.id },
            data: data.doctorData ?? {},
          });
        } else {
          await tx.doctor.create({
            data: {
              userId: updatedUser.id, ...(data.doctorData ?? {
                crmNumber: "TEMP",
                crmState: "PB",
                specialty: "General",
                department: "EMERGENCY",
                workStatus: "NOT_WORKING",
              })
            },
          });
        }
      }

      if (data.role === "NURSE") {
        if (userBeforeUpdate.nurse) {
          await tx.nurse.update({
            where: { id: userBeforeUpdate.nurse.id },
            data: data.nurseData ?? {},
          });
        } else {
          await tx.nurse.create({
            data: {
              userId: updatedUser.id, ...(data.nurseData ?? {
                corenNumber: "TEMP",
                corenState: "PB",
                level: "ASSISTANT",
                department: "WARD",
                experience: 0,
                workStatus: "NOT_WORKING",
              })
            },
          });
        }
      }

      if (data.role === "SECRETARY") {
        if (userBeforeUpdate.secretary) {
          await tx.secretary.update({
            where: { id: userBeforeUpdate.secretary.id },
            data: data.secretaryData ?? {},
          });
        } else {
          await tx.secretary.create({
            data: {
              userId: updatedUser.id, ...(data.secretaryData ?? {
                workStatus: "NOT_WORKING",
                shift: "MORNING",
              })
            },
          });
        }
      }

      return updatedUser;
    });

    return prisma.user.findUnique({
      where: { id: user.id },
      include: { doctor: true, nurse: true, secretary: true },
    }) as Promise<UserWithRelations>;
  },

  // Deletar usuário
  async deleteUser(id: number): Promise<UserWithRelations> {
    return prisma.user.delete({
      where: { id },
      include: { doctor: true, nurse: true, secretary: true },
    });
  },
};

export default userService;
