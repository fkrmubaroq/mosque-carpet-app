/*
  Warnings:

  - You are about to drop the column `logo` on the `setting` table. All the data in the column will be lost.
  - You are about to drop the column `social_media` on the `setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `setting` DROP COLUMN `logo`,
    DROP COLUMN `social_media`,
    ADD COLUMN `is_maintenance` ENUM('Y', 'N') NOT NULL DEFAULT 'N',
    ADD COLUMN `show_price` ENUM('Y', 'N') NOT NULL DEFAULT 'Y';
