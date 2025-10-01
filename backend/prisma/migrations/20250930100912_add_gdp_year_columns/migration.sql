/*
  Warnings:

  - You are about to drop the column `map` on the `gdpshare` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `gdpshare` table. All the data in the column will be lost.
  - You are about to drop the column `targetDescription` on the `gdpshare` table. All the data in the column will be lost.
  - You are about to drop the column `targetName` on the `gdpshare` table. All the data in the column will be lost.
  - You are about to drop the column `trend` on the `gdpshare` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `gdpshare` DROP COLUMN `map`,
    DROP COLUMN `source`,
    DROP COLUMN `targetDescription`,
    DROP COLUMN `targetName`,
    DROP COLUMN `trend`;
