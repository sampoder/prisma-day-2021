/*
  Warnings:

  - You are about to drop the column `authid` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users.authid_unique";

-- DropIndex
DROP INDEX "users.username_unique";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "authid",
DROP COLUMN "username";
