/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Nurse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'FINISHED');

-- CreateEnum
CREATE TYPE "public"."AppointmentType" AS ENUM ('CHECKUP', 'SURGERY', 'FOLLOW_UP');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "status" "public"."AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "type" "public"."AppointmentType" NOT NULL DEFAULT 'CHECKUP',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Doctor" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Nurse" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Patient" ADD COLUMN     "address" TEXT,
ADD COLUMN     "gender" "public"."Gender" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "password",
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_dateTime_idx" ON "public"."Appointment"("dateTime");

-- CreateIndex
CREATE INDEX "Doctor_crmNumber_idx" ON "public"."Doctor"("crmNumber");

-- CreateIndex
CREATE INDEX "Nurse_corenNumber_idx" ON "public"."Nurse"("corenNumber");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");
