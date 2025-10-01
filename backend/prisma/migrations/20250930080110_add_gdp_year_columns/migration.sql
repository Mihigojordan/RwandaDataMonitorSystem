/*
  Warnings:

  - You are about to drop the column `money` on the `gdpcurrentprice` table. All the data in the column will be lost.
  - You are about to drop the column `quarter` on the `gdpcurrentprice` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `gdpcurrentprice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `gdpcurrentprice` DROP COLUMN `money`,
    DROP COLUMN `quarter`,
    DROP COLUMN `year`,
    ADD COLUMN `currentYear` JSON NULL,
    ADD COLUMN `lastYear` JSON NULL;
