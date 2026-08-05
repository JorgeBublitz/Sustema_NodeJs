import { createCrudController } from "./crudController";
import secretaryService from "../services/secretaryService";
import { removePasswordDeep } from "../utils/sanitize.util";

const secretaryController = createCrudController({
  service: {
    getAll: () => secretaryService.getAllSecretaries(),
    getById: (id) => secretaryService.getSecretaryById(id),
    create: (data) => secretaryService.createSecretary(data),
    update: (id, data) => secretaryService.updateSecretary(id, data),
    delete: (id) => secretaryService.deleteSecretary(id),
  },
  nomeRecurso: "Secretário",
  sanitize: removePasswordDeep,
  referenceMessage: "Usuário informado não existe.",
});

export default secretaryController;
