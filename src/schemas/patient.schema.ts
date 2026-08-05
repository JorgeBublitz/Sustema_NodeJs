import { z } from "zod";
import { genderEnum, departmentEnum, patientStatusEnum } from "./enums.schema";

const cpf = z.string().min(11, "CPF deve ter pelo menos 11 caracteres.").max(14, "CPF muito longo.");
const email = z.string().email("E-mail inválido.").optional();
const phone = z.string().min(8, "Telefone inválido.").optional();

export const createPatientSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  age: z.coerce.number().int("Idade deve ser um número inteiro.").min(0, "Idade não pode ser negativa."),
  cpf,
  email,
  phone,
  gender: genderEnum,
  birthDate: z.coerce.date("Data de nascimento inválida."),
  address: z.string().optional(),
  allergy: z.string().optional(),
  drug: z.string().optional(),
  condition: patientStatusEnum,
  location: departmentEnum,
});

export const updatePatientSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres.").optional(),
  age: z.coerce.number().int("Idade deve ser um número inteiro.").min(0, "Idade não pode ser negativa.").optional(),
  cpf: cpf.optional(),
  email,
  phone,
  gender: genderEnum.optional(),
  birthDate: z.coerce.date("Data de nascimento inválida.").optional(),
  address: z.string().optional(),
  condition: patientStatusEnum.optional(),
  location: departmentEnum.optional(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
