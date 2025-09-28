-- CreateTable
CREATE TABLE `GPDRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `quarter` ENUM('Q1', 'Q2', 'Q3', 'Q4') NOT NULL,
    `amountBillionRwf` DOUBLE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GPDRecord_year_quarter_key`(`year`, `quarter`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
