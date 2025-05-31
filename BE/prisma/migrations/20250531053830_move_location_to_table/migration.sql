/*
  Warnings:

  - You are about to drop the column `location` on the `Event` table. All the data in the column will be lost.
  - Added the required column `locationId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "location",
ADD COLUMN     "locationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Point" ALTER COLUMN "points" SET DEFAULT 0;

-- DropEnum
DROP TYPE "Location";

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
