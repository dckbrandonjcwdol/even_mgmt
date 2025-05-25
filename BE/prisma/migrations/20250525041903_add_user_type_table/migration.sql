-- AlterTable
ALTER TABLE "User" ADD COLUMN     "user_type_id" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "UserType" (
    "id" SERIAL NOT NULL,
    "user_type_name" TEXT NOT NULL,

    CONSTRAINT "UserType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "UserType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
