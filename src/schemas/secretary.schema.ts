import { z } from "zod";
import { shiftEnum, workStatusEnum } from "./enums.schema";

export const createSecretarySchema = z.object({
  userId: z.coerce.number().int("userId deve ser um número inteiro.").positive(),
  shift: shiftEnum,
  workStatus: workStatusEnum.optional(),
});

export const updateSecretarySchema = z.object({
  shift: shiftEnum.optional(),
  workStatus: workStatusEnum.optional(),
});

export type CreateSecretaryInput = z.infer<typeof createSecretarySchema>;
export type UpdateSecretaryInput = z.infer<typeof updateSecretarySchema>;
