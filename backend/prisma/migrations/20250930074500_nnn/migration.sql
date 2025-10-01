-- CreateTable
CREATE TABLE `GdpCurrentPrice` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `quarter` VARCHAR(191) NOT NULL,
    `money` DOUBLE NOT NULL,
    `trends` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
