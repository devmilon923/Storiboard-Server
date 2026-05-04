-- CreateEnum
CREATE TYPE "LikeType" AS ENUM ('post', 'replie', 'comment');

-- CreateTable
CREATE TABLE "Likes" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "likeType" "LikeType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Likes_id_key" ON "Likes"("id");

-- CreateIndex
CREATE INDEX "Likes_sourceId_userId_likeType_idx" ON "Likes"("sourceId", "userId", "likeType");

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
