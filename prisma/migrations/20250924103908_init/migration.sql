/*
  Warnings:

  - You are about to drop the `Secretary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Secretary" DROP CONSTRAINT "Secretary_userId_fkey";

-- DropTable
DROP TABLE "public"."Secretary";
