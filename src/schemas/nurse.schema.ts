import { z } from "zod";
import { departmentEnum, workStatusEnum, stateBrEnum, nurseLevelEnum } from "./enums.schema";

const corenNumber = z.string().min(1, "COREN é obrigatório.");
const experience = z.coerce.number().int("Experiência deve ser um número inteiro.").min(0, "Experiência não pode ser negativa.");

export const createNurseSchema = z.object({
  userId: z.coerce.number().int("userId deve ser um número inteiro.").positive(),
  corenNumber,
  corenState: stateBrEnum,
  level: nurseLevelEnum,
  department: departmentEnum,
  experience: experience.default(0),
  specialization: z.string().optional(),
  workStatus: workStatusEnum.optional(),
});

export const updateNurseSchema = z.object({
  corenNumber: corenNumber.optional(),
  corenState: stateBrEnum.optional(),
  level: nurseLevelEnum.optional(),
  department: departmentEnum.optional(),
  experience: experience.optional(),
  specialization: z.string().optional(),
  workStatus: workStatusEnum.optional(),
});

export type CreateNurseInput = z.infer<typeof createNurseSchema>;
export type UpdateNurseInput = z.infer<typeof updateNurseSchema>;
