/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `post` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_authorId_fkey";

-- AlterTable
ALTER TABLE "post" ALTER COLUMN "likesCount" SET DEFAULT 0,
ALTER COLUMN "commentsCount" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "post_id_key" ON "post"("id");

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
