/*
  Warnings:

  - Changed the type of `likeState` on the `Likes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Likes" DROP COLUMN "likeState",
ADD COLUMN     "likeState" BOOLEAN NOT NULL;

-- DropEnum
DROP TYPE "LikeState";
