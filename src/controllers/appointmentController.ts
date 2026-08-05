import { createCrudController } from "./crudController";
import appointmentService from "../services/appointmentService";
import { removePasswordDeep } from "../utils/sanitize.util";

const appointmentController = createCrudController({
  service: {
    getAll: () => appointmentService.getAllAppointments(),
    getById: (id) => appointmentService.getAppointmentById(id),
    create: (data) => appointmentService.createAppointment(data),
    update: (id, data) => appointmentService.updateAppointmentById(id, data),
    delete: (id) => appointmentService.deleteAppointment(id),
  },
  nomeRecurso: "Agendamento",
  sanitize: removePasswordDeep,
  referenceMessage: "Doutor, paciente, enfermeiro ou secretário informado não existe.",
});

export default appointmentController;
