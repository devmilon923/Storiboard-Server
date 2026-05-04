/*
  Warnings:

  - A unique constraint covering the columns `[sourceId,likeType,userId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Likes_sourceId_userId_likeType_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Likes_sourceId_likeType_userId_key" ON "Likes"("sourceId", "likeType", "userId");
