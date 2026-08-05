import { createCrudController } from "./crudController";
import nurseService from "../services/nurseService";
import { removePasswordDeep } from "../utils/sanitize.util";

const nurseController = createCrudController({
  service: {
    getAll: () => nurseService.getAllNurses(),
    getById: (id) => nurseService.getNurseById(id),
    create: (data) => nurseService.createNurse(data),
    update: (id, data) => nurseService.updateNurseById(id, data),
    delete: (id) => nurseService.deleteNurse(id),
  },
  nomeRecurso: "Enfermeiro",
  sanitize: removePasswordDeep,
  conflictMessage: "Já existe um enfermeiro com este COREN.",
  referenceMessage: "Usuário não encontrado para o userId fornecido.",
});

export default nurseController;
