/*
  Warnings:

  - Changed the type of `location` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Location" AS ENUM ('JCCSenayan', 'BalaiKartini', 'TheKasablankaHall', 'ICEBSD', 'HotelMulia', 'DjakartaTheater', 'TransConventionCenter', 'Sabuga', 'HarrisCiumbuleuit', 'EldoradoDago', 'PullmanHotelBandung', 'GrandCityConvex', 'DyandraConvention', 'CiputraWorldSurabaya', 'ShangriLaSurabaya', 'PakuwonMall');

-- AlterTable
ALTER TABLE "Event"
  ALTER COLUMN "location" TYPE "Location"
  USING "location"::"Location";

 