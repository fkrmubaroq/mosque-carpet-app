/*
  Warnings:

  - A unique constraint covering the columns `[viewers_id]` on the table `article` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `article` ADD COLUMN `viewers_id` INTEGER UNSIGNED;

-- CreateTable
CREATE TABLE `ViewerArticle` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `total` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `article.viewers_id_unique` ON `article`(`viewers_id`);

-- CreateIndex
CREATE INDEX `viewers_FK` ON `article`(`viewers_id`);

-- AddForeignKey
ALTER TABLE `article` ADD FOREIGN KEY (`viewers_id`) REFERENCES `ViewerArticle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
