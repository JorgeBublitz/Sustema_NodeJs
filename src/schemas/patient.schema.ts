import { z } from "zod";
import { genderEnum, departmentEnum, patientStatusEnum } from "./enums.schema";

const cpf = z.string().min(11, "CPF deve ter pelo menos 11 caracteres.").max(14, "CPF muito longo.");
const email = z.string().trim().toLowerCase().email("E-mail inválido.").optional();
const phone = z.string().min(8, "Telefone inválido.").optional();

const name = z.string().trim().min(2, "O nome deve ter pelo menos 2 caracteres.").max(120, "Nome muito longo.");
const address = z.string().trim().max(200, "Endereço muito longo.").optional();
const allergy = z.string().trim().max(300, "Descrição de alergia muito longa.").optional();
const drug = z.string().trim().max(300, "Descrição de medicamento muito longa.").optional();

export const createPatientSchema = z.object({
  name,
  age: z.coerce.number().int("Idade deve ser um número inteiro.").min(0, "Idade não pode ser negativa."),
  cpf,
  email,
  phone,
  gender: genderEnum,
  birthDate: z.coerce.date("Data de nascimento inválida."),
  address,
  allergy,
  drug,
  condition: patientStatusEnum,
  location: departmentEnum,
});

export const updatePatientSchema = z.object({
  name: name.optional(),
  age: z.coerce.number().int("Idade deve ser um número inteiro.").min(0, "Idade não pode ser negativa.").optional(),
  cpf: cpf.optional(),
  email,
  phone,
  gender: genderEnum.optional(),
  birthDate: z.coerce.date("Data de nascimento inválida.").optional(),
  address,
  allergy,
  drug,
  condition: patientStatusEnum.optional(),
  location: departmentEnum.optional(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
