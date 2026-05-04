/*
  Warnings:

  - Added the required column `likeState` to the `Likes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LikeState" AS ENUM ('liked', 'unliked');

-- AlterTable
ALTER TABLE "Likes" ADD COLUMN     "likeState" "LikeState" NOT NULL;
