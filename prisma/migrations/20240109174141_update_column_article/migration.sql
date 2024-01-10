/*
  Warnings:

  - You are about to drop the `ViewerArticle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `article` DROP FOREIGN KEY `article_ibfk_1`;

-- DropTable
DROP TABLE `ViewerArticle`;

-- CreateTable
CREATE TABLE `viewers_article` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `total` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `article` ADD FOREIGN KEY (`viewers_id`) REFERENCES `viewers_article`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
