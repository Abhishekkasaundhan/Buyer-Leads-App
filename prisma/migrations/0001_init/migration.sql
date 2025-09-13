-- Migration: initial
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL
);
CREATE TABLE "Buyer" (
  "id" TEXT PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "propertyType" TEXT NOT NULL,
  "bhk" TEXT,
  "purpose" TEXT NOT NULL,
  "budgetMin" INTEGER,
  "budgetMax" INTEGER,
  "timeline" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'New',
  "notes" TEXT,
  "tags" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("ownerId") REFERENCES "User" ("id")
);
CREATE TABLE "BuyerHistory" (
  "id" TEXT PRIMARY KEY,
  "buyerId" TEXT NOT NULL,
  "changedBy" TEXT NOT NULL,
  "changedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "diff" TEXT NOT NULL,
  FOREIGN KEY ("buyerId") REFERENCES "Buyer" ("id")
);
