import { z } from "zod";

const dateTime = z.coerce.date("Data/hora inválida.");
const id = z.coerce.number().int().positive();

export const createAppointmentSchema = z.object({
  dateTime,
  doctorIds: z.array(id).optional(),
  nurseIds: z.array(id).optional(),
  patientId: id,
  secretaryId: id.optional(),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  dateTime: dateTime.optional(),
  doctorIds: z.array(id).optional(),
  nurseIds: z.array(id).optional(),
  patientId: id.optional(),
  secretaryId: id.optional(),
  notes: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
