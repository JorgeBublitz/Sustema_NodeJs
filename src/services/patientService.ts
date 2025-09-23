import prisma from "../database/prismaClient";
import type { Prisma, Condition, Room, Gender } from "../generated/prisma";

export type PatientWithRelations = Prisma.PatientGetPayload<{
    include: { appointments: true }
}>;

const patientService = {
    async getAllPatients(): Promise<PatientWithRelations[]> {
        return prisma.patient.findMany({
            include: { appointments: true },
        });
    },

    async getPatientById(id: number): Promise<PatientWithRelations | null> {
        return prisma.patient.findUnique({
            where: { id },
            include: { appointments: true },
        });
    },

    async createPatient(data: {
        name: string;
        email?: string;
        phone?: string;
        birthDate: Date;
        gender: Gender;
        condition: Condition;
        location: Room;
    }): Promise<PatientWithRelations> {
        return prisma.patient.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                birthDate: data.birthDate,
                gender: data.gender,
                condition: data.condition,
                location: data.location,
            },
            include: { appointments: true },
        });
    },

    async updatePatientById(
        id: number,
        data: {
            name?: string;
            email?: string;
            phone?: string;
            birthDate?: Date;
            gender?: Gender;
            condition?: Condition;
            location?: Room;
        }
    ): Promise<PatientWithRelations> {
        return prisma.patient.update({
            where: { id },
            data,
            include: { appointments: true },
        });
    },

    async deletePatient(id: number): Promise<PatientWithRelations> {
        return prisma.patient.delete({
            where: { id },
            include: { appointments: true },
        });
    },
};

export default patientService;
