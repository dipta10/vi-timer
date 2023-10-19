-- add uuid_generate_v1()
-- https://github.com/prisma/prisma/issues/6822
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v1(),
    "username" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v1(),
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "project" VARCHAR(30),

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
