/*
  Warnings:

  - You are about to drop the `AppointmentHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AppointmentHistory" DROP CONSTRAINT "AppointmentHistory_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AppointmentHistory" DROP CONSTRAINT "AppointmentHistory_changedById_fkey";

-- DropTable
DROP TABLE "public"."AppointmentHistory";
