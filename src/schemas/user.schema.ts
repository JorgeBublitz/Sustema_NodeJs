import { z } from "zod";
import {
  roleEnum,
  genderEnum,
  departmentEnum,
  workStatusEnum,
  nurseLevelEnum,
  shiftEnum,
  stateBrEnum,
} from "./enums.schema";

const email = z.string().email("E-mail inválido.");
const name = z.string().min(2, "O nome deve ter pelo menos 2 caracteres.");
const age = z.coerce.number().int("Idade deve ser um número inteiro.").min(0, "Idade não pode ser negativa.");
const password = z.string().min(6, "A senha deve ter pelo menos 6 caracteres.");

// Dados complementares aceitos no create/update de usuários
// (resolve o bug "TEMP": antes criava CRM/COREN fixos e o 2º médico dava erro)
const doctorData = z
  .object({
    crmNumber: z.string().min(1, "CRM é obrigatório."),
    crmState: stateBrEnum,
    specialty: z.string().min(1, "Especialidade é obrigatória."),
    department: departmentEnum,
    workStatus: workStatusEnum.optional(),
  })
  .optional();

const nurseData = z
  .object({
    corenNumber: z.string().min(1, "COREN é obrigatório."),
    corenState: stateBrEnum,
    level: nurseLevelEnum,
    department: departmentEnum,
    experience: z.coerce.number().int().min(0).default(0),
    specialization: z.string().optional(),
    workStatus: workStatusEnum.optional(),
  })
  .optional();

const secretaryData = z
  .object({
    shift: shiftEnum,
    workStatus: workStatusEnum.optional(),
  })
  .optional();

export const createUserSchema = z.object({
  name,
  age,
  gender: genderEnum,
  email,
  password,
  role: roleEnum,
  doctorData,
  nurseData,
  secretaryData,
});

export const updateUserSchema = z.object({
  name: name.optional(),
  age: age.optional(),
  gender: genderEnum.optional(),
  email: email.optional(),
  password: password.optional(),
  role: roleEnum.optional(),
  doctorData,
  nurseData,
  secretaryData,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
