/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the column as nullable
ALTER TABLE "User" ADD COLUMN "name" TEXT;

-- Update existing users with a default name
UPDATE "User" SET "name" = email WHERE "name" IS NULL;

-- Make the column required
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
