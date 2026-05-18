/*
  Warnings:

  - The values [REPLIE_ON_COMMENT,REPLIE_ON_REPLIE] on the enum `notificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isCommentOnComment` on the `notificationSetting` table. All the data in the column will be lost.
  - You are about to drop the column `isCommentOnPost` on the `notificationSetting` table. All the data in the column will be lost.
  - You are about to drop the column `isLikeOnComment` on the `notificationSetting` table. All the data in the column will be lost.
  - You are about to drop the column `isLikeOnPost` on the `notificationSetting` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "notificationType_new" AS ENUM ('LIKE_ON_POST', 'LIKE_ON_COMMENT', 'COMMENT_ON_POST', 'COMMENT_ON_COMMENT', 'FOLLOW');
ALTER TABLE "Notifications" ALTER COLUMN "notiType" TYPE "notificationType_new" USING ("notiType"::text::"notificationType_new");
ALTER TYPE "notificationType" RENAME TO "notificationType_old";
ALTER TYPE "notificationType_new" RENAME TO "notificationType";
DROP TYPE "public"."notificationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "notificationSetting" DROP COLUMN "isCommentOnComment",
DROP COLUMN "isCommentOnPost",
DROP COLUMN "isLikeOnComment",
DROP COLUMN "isLikeOnPost",
ADD COLUMN     "COMMENT_ON_POST" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "LIKE_ON_COMMENT" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "LIKE_ON_POST" BOOLEAN NOT NULL DEFAULT true;
