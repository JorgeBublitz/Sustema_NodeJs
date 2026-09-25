import { z } from "zod";
import { departmentEnum, workStatusEnum, stateBrEnum } from "./enums.schema";

const crmNumber = z.string().trim().min(1, "CRM é obrigatório.").max(20, "CRM muito longo.");
const specialty = z.string().trim().min(1, "Especialidade é obrigatória.").max(120, "Especialidade muito longa.");

export const createDoctorSchema = z.object({
  userId: z.coerce.number().int("userId deve ser um número inteiro.").positive(),
  crmNumber,
  crmState: stateBrEnum,
  specialty,
  department: departmentEnum,
  workStatus: workStatusEnum.optional(),
});

export const updateDoctorSchema = z.object({
  crmNumber: crmNumber.optional(),
  crmState: stateBrEnum.optional(),
  specialty: specialty.optional(),
  department: departmentEnum.optional(),
  workStatus: workStatusEnum.optional(),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
