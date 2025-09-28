-- CreateTable
CREATE TABLE `GPDShareBySector` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `quarter` ENUM('Q1', 'Q2', 'Q3', 'Q4') NOT NULL,
    `totalGDP` DOUBLE NOT NULL,
    `service` DOUBLE NOT NULL,
    `agriculture` DOUBLE NOT NULL,
    `tax` DOUBLE NOT NULL,
    `industry` DOUBLE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
