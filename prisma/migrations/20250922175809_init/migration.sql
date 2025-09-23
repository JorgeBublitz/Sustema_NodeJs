/*
  Warnings:

  - A unique constraint covering the columns `[corenNumber,corenState]` on the table `Nurse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `corenNumber` to the `Nurse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `corenState` to the `Nurse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Nurse" ADD COLUMN     "corenNumber" TEXT NOT NULL,
ADD COLUMN     "corenState" "public"."EstadoBR" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Nurse_corenNumber_corenState_key" ON "public"."Nurse"("corenNumber", "corenState");
