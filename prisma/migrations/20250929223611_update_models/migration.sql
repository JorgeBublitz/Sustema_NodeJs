-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- AlterTable
ALTER TABLE "public"."Appointment" ALTER COLUMN "doctorId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."AppointmentNurse" (
    "appointmentId" INTEGER NOT NULL,
    "nurseId" INTEGER NOT NULL,

    CONSTRAINT "AppointmentNurse_pkey" PRIMARY KEY ("appointmentId","nurseId")
);

-- CreateTable
CREATE TABLE "public"."AppointmentDoctor" (
    "appointmentId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "AppointmentDoctor_pkey" PRIMARY KEY ("appointmentId","doctorId")
);

-- AddForeignKey
ALTER TABLE "public"."AppointmentNurse" ADD CONSTRAINT "AppointmentNurse_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentNurse" ADD CONSTRAINT "AppointmentNurse_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "public"."Nurse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentDoctor" ADD CONSTRAINT "AppointmentDoctor_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentDoctor" ADD CONSTRAINT "AppointmentDoctor_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
