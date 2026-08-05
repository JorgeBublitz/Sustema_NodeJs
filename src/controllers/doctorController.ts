import { createCrudController } from "./crudController";
import doctorService from "../services/doctorService";
import { removePasswordDeep } from "../utils/sanitize.util";

const doctorController = createCrudController({
  service: {
    getAll: () => doctorService.getAllDoctors(),
    getById: (id) => doctorService.getDoctorById(id),
    create: (data) => doctorService.createDoctor(data),
    update: (id, data) => doctorService.updateDoctorById(id, data),
    delete: (id) => doctorService.deleteDoctor(id),
  },
  nomeRecurso: "Médico",
  sanitize: removePasswordDeep,
  conflictMessage: "Já existe um médico com este CRM.",
  referenceMessage: "Usuário não encontrado para o userId fornecido.",
});

export default doctorController;
