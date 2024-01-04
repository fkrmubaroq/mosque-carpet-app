-- AlterTable
ALTER TABLE `sections` ADD COLUMN `active` ENUM('Y', 'N') NOT NULL DEFAULT 'Y';
