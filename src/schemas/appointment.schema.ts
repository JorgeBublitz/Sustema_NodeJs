import { z } from "zod";

const dateTime = z.coerce.date("Data/hora inválida.");
const id = z.coerce.number().int().positive();
const notes = z.string().trim().max(1000, "Observações muito longas.").optional();

export const createAppointmentSchema = z.object({
  dateTime,
  doctorIds: z.array(id).min(1, "É necessário informar pelo menos um médico."),
  nurseIds: z.array(id).optional(),
  patientId: id,
  secretaryId: id.optional(),
  notes,
});

export const updateAppointmentSchema = z.object({
  dateTime: dateTime.optional(),
  doctorIds: z.array(id).min(1, "É necessário informar pelo menos um médico.").optional(),
  nurseIds: z.array(id).optional(),
  patientId: id.optional(),
  secretaryId: id.optional(),
  notes,
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
