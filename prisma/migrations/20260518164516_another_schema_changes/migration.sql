/*
  Warnings:

  - The values [COMMENT_ON_COMMENT] on the enum `notificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "notificationType_new" AS ENUM ('LIKE_ON_POST', 'LIKE_ON_COMMENT', 'COMMENT_ON_POST', 'COMMENT_ON_REPLIE', 'FOLLOW');
ALTER TABLE "Notifications" ALTER COLUMN "notiType" TYPE "notificationType_new" USING ("notiType"::text::"notificationType_new");
ALTER TYPE "notificationType" RENAME TO "notificationType_old";
ALTER TYPE "notificationType_new" RENAME TO "notificationType";
DROP TYPE "public"."notificationType_old";
COMMIT;
