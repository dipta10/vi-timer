/*
  Warnings:

  - You are about to drop the column `projectId` on the `Todo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_projectId_fkey";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "projectId";
