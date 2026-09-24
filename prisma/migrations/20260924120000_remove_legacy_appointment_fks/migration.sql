/*
  Remove as colunas legadas doctorId e nurseId de Appointment.

  Os médicos e enfermeiros de um agendamento ficam nas tabelas de junção
  AppointmentDoctor e AppointmentNurse. As colunas antigas nunca eram
  preenchidas, e por isso a lista de agendamentos de médicos e enfermeiros
  sempre vinha vazia.
*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_nurseId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "doctorId",
DROP COLUMN "nurseId";
