import prisma from "../database/prismaClient";
import type { StateBR, Prisma, Department, WorkStatus } from "../generated/prisma";
import { HttpError } from "../utils/http-error";

// Tipo com relacionamentos
export type DoctorWithRelations = Prisma.DoctorGetPayload<{
    include: { user: true; appointments: { include: { appointment: true } } }
}>;

const doctorService = {
    async getAllDoctors(): Promise<DoctorWithRelations[]> {
        return prisma.doctor.findMany({
            include: { user: true, appointments: { include: { appointment: true } } },
        });
    },

    async getDoctorById(id: number): Promise<DoctorWithRelations | null> {
        return prisma.doctor.findUnique({
            where: { id },
            include: { user: true, appointments: { include: { appointment: true } } },
        });
    },

    async createDoctor(data: { userId: number; workStatus: WorkStatus; crmNumber: string; crmState: StateBR; specialty: string; department: Department }): Promise<DoctorWithRelations> {
        const user = await prisma.user.findUnique({ where: { id: data.userId } });
        if (!user) {
            throw new HttpError(400, "Usuário não encontrado.");
        }
        if (user.role !== "DOCTOR") {
            throw new HttpError(400, "O usuário informado não possui o cargo (role) de DOCTOR.");
        }

        const existingDoctor = await prisma.doctor.findUnique({ where: { userId: data.userId } });
        if (existingDoctor) {
            throw new HttpError(409, "Já existe um registro de médico para este usuário.");
        }

        return prisma.doctor.create({
            data: {
                userId: data.userId,
                workStatus: data.workStatus,
                crmNumber: data.crmNumber,
                crmState: data.crmState,
                specialty: data.specialty,
                department: data.department
            },
            include: { user: true, appointments: { include: { appointment: true } } }
        });
    },

    async updateDoctorById(
        id: number,
        data: {
            crmNumber: string,
            crmState: StateBR,
            specialty: string,
            workStatus: WorkStatus,
            department: Department
        }
    ): Promise<DoctorWithRelations> {
        return prisma.doctor.update({
            where: { id },
            data,
            include: { user: true, appointments: { include: { appointment: true } } },
        });
    },

    async deleteDoctor(id: number): Promise<DoctorWithRelations> {
        return prisma.doctor.delete({
            where: { id },
            include: { user: true, appointments: { include: { appointment: true } } },
        });
    },
};

export default doctorService;
