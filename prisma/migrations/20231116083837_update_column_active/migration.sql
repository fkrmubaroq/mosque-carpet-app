/*
  Warnings:

  - You are about to drop the column `status` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `status`,
    ADD COLUMN `active` ENUM('Y', 'N') NOT NULL DEFAULT 'N';
