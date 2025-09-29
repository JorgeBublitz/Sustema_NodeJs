/*
  Warnings:

  - You are about to drop the column `nurseId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `crmState` on the `Doctor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `department` to the `Nurse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `Nurse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Nurse` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `corenState` on the `Nurse` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `condition` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `location` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Department" AS ENUM ('EMERGENCY', 'SURGERY', 'ICU', 'WARD');

-- CreateEnum
CREATE TYPE "public"."PatientStatus" AS ENUM ('IN_SURGERY', 'REST', 'WAITING');

-- CreateEnum
CREATE TYPE "public"."NurseLevel" AS ENUM ('ASSISTANT', 'TECHNICIAN', 'GRADUATE');

-- CreateEnum
CREATE TYPE "public"."Shift" AS ENUM ('MORNING', 'AFTERNOON', 'NIGHT');

-- CreateEnum
CREATE TYPE "public"."WorkStatus" AS ENUM ('WORKING', 'VACATION', 'NOT_WORKING', 'ON_LEAVE', 'SICK_LEAVE');

-- CreateEnum
CREATE TYPE "public"."StateBR" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');

-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_nurseId_fkey";

-- DropIndex
DROP INDEX "public"."Doctor_crmNumber_idx";

-- DropIndex
DROP INDEX "public"."User_email_idx";

-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "nurseId",
ADD COLUMN     "secretaryId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Doctor" ADD COLUMN     "department" "public"."Department" NOT NULL,
ADD COLUMN     "workStatus" "public"."WorkStatus" NOT NULL DEFAULT 'NOT_WORKING',
DROP COLUMN "crmState",
ADD COLUMN     "crmState" "public"."StateBR" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Nurse" ADD COLUMN     "department" "public"."Department" NOT NULL,
ADD COLUMN     "experience" INTEGER NOT NULL,
ADD COLUMN     "level" "public"."NurseLevel" NOT NULL,
ADD COLUMN     "specialization" TEXT,
ADD COLUMN     "workStatus" "public"."WorkStatus" NOT NULL DEFAULT 'NOT_WORKING',
DROP COLUMN "corenState",
ADD COLUMN     "corenState" "public"."StateBR" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Patient" ADD COLUMN     "allergy" TEXT,
ADD COLUMN     "drug" TEXT,
DROP COLUMN "condition",
ADD COLUMN     "condition" "public"."PatientStatus" NOT NULL,
DROP COLUMN "location",
ADD COLUMN     "location" "public"."Department" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "passwordHash",
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "gender" "public"."Gender" NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."Condition";

-- DropEnum
DROP TYPE "public"."EstadoBR";

-- DropEnum
DROP TYPE "public"."Room";

-- CreateTable
CREATE TABLE "public"."Secretary" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "workStatus" "public"."WorkStatus" NOT NULL DEFAULT 'NOT_WORKING',
    "shift" "public"."Shift" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Secretary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AppointmentNurse" (
    "appointmentId" INTEGER NOT NULL,
    "nurseId" INTEGER NOT NULL,

    CONSTRAINT "AppointmentNurse_pkey" PRIMARY KEY ("appointmentId","nurseId")
);

-- CreateTable
CREATE TABLE "public"."AppointmentHistory" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "changedById" INTEGER,
    "fieldChanged" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Secretary_userId_key" ON "public"."Secretary"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_crmNumber_crmState_key" ON "public"."Doctor"("crmNumber", "crmState");

-- CreateIndex
CREATE UNIQUE INDEX "Nurse_corenNumber_corenState_key" ON "public"."Nurse"("corenNumber", "corenState");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phone_key" ON "public"."Patient"("phone");

-- AddForeignKey
ALTER TABLE "public"."Secretary" ADD CONSTRAINT "Secretary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_secretaryId_fkey" FOREIGN KEY ("secretaryId") REFERENCES "public"."Secretary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentNurse" ADD CONSTRAINT "AppointmentNurse_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentNurse" ADD CONSTRAINT "AppointmentNurse_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "public"."Nurse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentHistory" ADD CONSTRAINT "AppointmentHistory_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentHistory" ADD CONSTRAINT "AppointmentHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
