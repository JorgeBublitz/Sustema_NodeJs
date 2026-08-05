import { z } from "zod";
import {
  Role,
  Gender,
  Department,
  WorkStatus,
  NurseLevel,
  Shift,
  PatientStatus,
  StateBR,
} from "../generated/prisma";

/** Reutiliza os enums do Prisma nas validações Zod. */
export const roleEnum = z.nativeEnum(Role);
export const genderEnum = z.nativeEnum(Gender);
export const departmentEnum = z.nativeEnum(Department);
export const workStatusEnum = z.nativeEnum(WorkStatus);
export const nurseLevelEnum = z.nativeEnum(NurseLevel);
export const shiftEnum = z.nativeEnum(Shift);
export const patientStatusEnum = z.nativeEnum(PatientStatus);
export const stateBrEnum = z.nativeEnum(StateBR);

/** ID positivo de rota/recurso. */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("ID deve ser um número inteiro positivo."),
});
