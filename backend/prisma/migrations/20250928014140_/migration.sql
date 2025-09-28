/*
  Warnings:

  - The primary key for the `gpdrecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `gpdsharebysector` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `quarter` on the `gpdsharebysector` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[year]` on the table `GPDShareBySector` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `gpdrecord` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `gpdsharebysector` DROP PRIMARY KEY,
    DROP COLUMN `quarter`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `GPDShareBySector_year_key` ON `GPDShareBySector`(`year`);
