/*
  Warnings:

  - You are about to drop the column `branch` on the `setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `setting` DROP COLUMN `branch`,
    ADD COLUMN `link_address` VARCHAR(191);
