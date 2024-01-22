/*
  Warnings:

  - You are about to drop the column `token` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Popup` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `discount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `image` MEDIUMTEXT;

-- AlterTable
ALTER TABLE `setting` ADD COLUMN `logo` VARCHAR(255),
    ADD COLUMN `logo_title` VARCHAR(100);

-- AlterTable
ALTER TABLE `user` DROP COLUMN `token`,
    MODIFY `role` ENUM('SUPER_ADMIN', 'ADMIN', 'STAFF') NOT NULL DEFAULT 'ADMIN';

-- DropTable
DROP TABLE `Popup`;

-- CreateTable
CREATE TABLE `popup` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `start_at` DATE NOT NULL,
    `end_at` DATE NOT NULL,
    `active` ENUM('Y', 'N') NOT NULL DEFAULT 'Y',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
