/*
  Warnings:

  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roles" "Role"[] DEFAULT ARRAY['USER']::"Role"[],
ALTER COLUMN "name" SET NOT NULL;
