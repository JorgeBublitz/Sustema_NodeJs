import prisma from "../database/prismaClient";
import type { Prisma } from "../generated/prisma";

export type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: {
    doctors: { include: { doctor: { include: { user: true } } } };
    nurses: { include: { nurse: { include: { user: true } } } };
    patient: true;
    secretary: { include: { user: true } };
  };
}>;

const appointmentService = {
  async getAllAppointments(): Promise<AppointmentWithRelations[]> {
    return prisma.appointment.findMany({
      include: {
        doctors: { include: { doctor: { include: { user: true } } } },
        nurses: { include: { nurse: { include: { user: true } } } },
        patient: true,
        secretary: { include: { user: true } },
      },
    });
  },

  async getAppointmentById(id: number): Promise<AppointmentWithRelations | null> {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        doctors: { include: { doctor: { include: { user: true } } } },
        nurses: { include: { nurse: { include: { user: true } } } },
        patient: true,
        secretary: { include: { user: true } },
      },
    });
  },

  async createAppointment(data: {
    dateTime: Date;
    doctorIds: number[];
    patientId: number;
    nurseIds?: number[];
    notes?: string;
    secretaryId?: number;
  }): Promise<AppointmentWithRelations> {
    const appointment = await prisma.appointment.create({
      data: {
        dateTime: data.dateTime,
        patientId: data.patientId,
        secretaryId: data.secretaryId,
        notes: data.notes,
        doctors: { create: data.doctorIds.map((doctorId) => ({ doctorId })) },
        nurses: data.nurseIds
          ? { create: data.nurseIds.map((nurseId) => ({ nurseId })) }
          : undefined,
      },
      include: {
        doctors: { include: { doctor: { include: { user: true } } } },
        nurses: { include: { nurse: { include: { user: true } } } },
        patient: true,
        secretary: { include: { user: true } },
      },
    });

    return this.getAppointmentById(appointment.id) as Promise<AppointmentWithRelations>;
  },

  async updateAppointmentById(
    id: number,
    data: {
      dateTime?: Date;
      doctorIds?: number[];
      patientId?: number;
      nurseIds?: number[];
      notes?: string;
      secretaryId?: number;
    }
  ): Promise<AppointmentWithRelations> {
    await prisma.appointment.update({
      where: { id },
      data: {
        dateTime: data.dateTime,
        patientId: data.patientId,
        secretaryId: data.secretaryId,
        notes: data.notes,
        doctors: data.doctorIds
          ? {
            deleteMany: {},
            create: data.doctorIds.map((doctorId) => ({ doctorId })),
          }
          : undefined,
        nurses: data.nurseIds
          ? {
            deleteMany: {},
            create: data.nurseIds.map((nurseId) => ({ nurseId })),
          }
          : undefined,
      },
    });

    return this.getAppointmentById(id) as Promise<AppointmentWithRelations>;
  },

  async deleteAppointment(id: number): Promise<AppointmentWithRelations> {
    const appointment = await this.getAppointmentById(id);
    if (!appointment) throw new Error(`Appointment with ID ${id} not found.`);
    await prisma.appointment.delete({ where: { id } });
    return appointment;
  },
};

export default appointmentService;
