/*
  Warnings:

  - You are about to alter the column `created_at` on the `article` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `article` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Products` DROP FOREIGN KEY `products_ibfk_1`;

-- AlterTable
ALTER TABLE `article` MODIFY `created_at` DATETIME NOT NULL,
    MODIFY `updated_at` DATETIME NOT NULL;

-- DropTable
DROP TABLE `Category`;

-- DropTable
DROP TABLE `Products`;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `category.id_unique`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `price` INTEGER NOT NULL,
    `stock` SMALLINT NOT NULL,
    `category_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `product.id_unique`(`id`),
    INDEX `category_FK`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product` ADD FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
