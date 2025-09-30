/*
  Warnings:

  - Added the required column `cpf` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Patient" ADD COLUMN     "cpf" TEXT NOT NULL;
