/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Patient_cpf_key" ON "public"."Patient"("cpf");
