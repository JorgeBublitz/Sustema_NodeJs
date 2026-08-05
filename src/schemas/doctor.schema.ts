import { z } from "zod";
import { departmentEnum, workStatusEnum, stateBrEnum } from "./enums.schema";

const crmNumber = z.string().min(1, "CRM é obrigatório.");

export const createDoctorSchema = z.object({
  userId: z.coerce.number().int("userId deve ser um número inteiro.").positive(),
  crmNumber,
  crmState: stateBrEnum,
  specialty: z.string().min(1, "Especialidade é obrigatória."),
  department: departmentEnum,
  workStatus: workStatusEnum.optional(),
});

export const updateDoctorSchema = z.object({
  crmNumber: crmNumber.optional(),
  crmState: stateBrEnum.optional(),
  specialty: z.string().min(1, "Especialidade é obrigatória.").optional(),
  department: departmentEnum.optional(),
  workStatus: workStatusEnum.optional(),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
