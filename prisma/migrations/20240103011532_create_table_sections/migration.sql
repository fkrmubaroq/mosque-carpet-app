-- CreateTable
CREATE TABLE `sections` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `section_name` VARCHAR(100) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `position` TINYINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
