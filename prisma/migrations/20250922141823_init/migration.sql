/*
  Warnings:

  - You are about to drop the column `crm` on the `Doctor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[crmNumber,crmState]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `crmNumber` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crmState` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condition` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Room" AS ENUM ('PS', 'SURGERY', 'UTI', 'WARD');

-- CreateEnum
CREATE TYPE "public"."Condition" AS ENUM ('SURGERY', 'REST', 'WAIT');

-- CreateEnum
CREATE TYPE "public"."EstadoBR" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');

-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'NURSE';

-- DropIndex
DROP INDEX "public"."Doctor_crm_key";

-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nurseId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Doctor" DROP COLUMN "crm",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "crmNumber" TEXT NOT NULL,
ADD COLUMN     "crmState" "public"."EstadoBR" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Patient" ADD COLUMN     "condition" "public"."Condition" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" "public"."Room" NOT NULL;

-- CreateTable
CREATE TABLE "public"."Nurse" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Nurse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nurse_userId_key" ON "public"."Nurse"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_crmNumber_crmState_key" ON "public"."Doctor"("crmNumber", "crmState");

-- AddForeignKey
ALTER TABLE "public"."Nurse" ADD CONSTRAINT "Nurse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "public"."Nurse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
