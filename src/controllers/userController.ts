import { createCrudController } from "./crudController";
import userService from "../services/userService";
import { removePasswordDeep } from "../utils/sanitize.util";

const userController = createCrudController({
  service: {
    getAll: () => userService.getAllUsers(),
    getById: (id) => userService.getUserById(id),
    create: (data) => userService.createUser(data),
    update: (id, data) => userService.updateUserById(id, data),
    delete: (id) => userService.deleteUser(id),
  },
  nomeRecurso: "Usuário",
  sanitize: removePasswordDeep,
  conflictMessage: "Já existe um usuário com este e-mail.",
  createExtractor: (body) => ({
    name: body.name as string,
    age: body.age as number,
    gender: body.gender as "MALE" | "FEMALE",
    email: body.email as string,
    password: body.password as string,
    role: body.role as "ADMIN" | "SECRETARY" | "DOCTOR" | "NURSE",
    doctorData: body.doctorData as Record<string, unknown> | undefined,
    nurseData: body.nurseData as Record<string, unknown> | undefined,
    secretaryData: body.secretaryData as Record<string, unknown> | undefined,
  }),
  updateExtractor: (body) => ({
    name: body.name as string | undefined,
    age: body.age as number | undefined,
    gender: body.gender as "MALE" | "FEMALE" | undefined,
    email: body.email as string | undefined,
    password: body.password as string | undefined,
    role: body.role as "ADMIN" | "SECRETARY" | "DOCTOR" | "NURSE" | undefined,
    doctorData: body.doctorData as Record<string, unknown> | undefined,
    nurseData: body.nurseData as Record<string, unknown> | undefined,
    secretaryData: body.secretaryData as Record<string, unknown> | undefined,
  }),
});

export default userController;
