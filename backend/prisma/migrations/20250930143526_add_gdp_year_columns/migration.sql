-- CreateTable
CREATE TABLE `GdpGrowthBySectorAtConstantPrice` (
    `id` VARCHAR(191) NOT NULL,
    `totalGdp` DOUBLE NOT NULL,
    `servicesShare` DOUBLE NOT NULL,
    `industryShare` DOUBLE NOT NULL,
    `agricultureShare` DOUBLE NOT NULL,
    `taxesShare` DOUBLE NOT NULL,
    `servicesSubShares` JSON NOT NULL,
    `agricultureSubShares` JSON NOT NULL,
    `industrySubShares` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
