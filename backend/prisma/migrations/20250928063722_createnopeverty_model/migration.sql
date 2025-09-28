-- CreateTable
CREATE TABLE `NoPovertyTarget` (
    `id` VARCHAR(191) NOT NULL,
    `targetName` VARCHAR(191) NOT NULL,
    `targetDescription` VARCHAR(191) NULL,
    `targetPercentage` DOUBLE NULL,
    `source` VARCHAR(191) NULL,
    `trend` JSON NULL,
    `map` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
