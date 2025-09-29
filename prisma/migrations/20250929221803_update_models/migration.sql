/*
  Warnings:

  - You are about to drop the `AppointmentNurse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AppointmentNurse" DROP CONSTRAINT "AppointmentNurse_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AppointmentNurse" DROP CONSTRAINT "AppointmentNurse_nurseId_fkey";

-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "nurseId" INTEGER;

-- DropTable
DROP TABLE "public"."AppointmentNurse";

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "public"."Nurse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
