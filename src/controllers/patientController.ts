import { createCrudController } from "./crudController";
import patientService from "../services/patientService";

const patientController = createCrudController({
  service: {
    getAll: () => patientService.getAllPatients(),
    getById: (id) => patientService.getPatientById(id),
    create: (data) => patientService.createPatient(data),
    update: (id, data) => patientService.updatePatientById(id, data),
    delete: (id) => patientService.deletePatient(id),
  },
  nomeRecurso: "Paciente",
  conflictMessage: "Já existe um paciente com este email, CPF ou telefone.",
  referenceMessage: "Referência inválida (ex: paciente ou médico não existe).",
});

export default patientController;
