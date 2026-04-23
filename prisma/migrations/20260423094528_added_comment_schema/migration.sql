-- CreateEnum
CREATE TYPE "CommentType" AS ENUM ('post', 'replie');

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentType" "CommentType" NOT NULL,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
