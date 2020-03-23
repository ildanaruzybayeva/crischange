DROP SCHEMA IF EXISTS "public" CASCADE;
CREATE SCHEMA IF NOT EXISTS "public";

DROP TABLE IF EXISTS "users";
CREATE TABLE IF NOT EXISTS "users"
(
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "gender" VARCHAR(255) NOT NULL,
    "postal_code" INTEGER NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "profile_picture_url" VARCHAR(255),
    "birth_date" VARCHAR(255),
    "date_created" TIMESTAMP NOT NULL DEFAULT NOW(),
    "about" VARCHAR(255) NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 0,
    "is_verified" BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS "posts";
CREATE TABLE IF NOT EXISTS "posts"
(
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES users(id) NOT NULL,
    "caption"  VARCHAR(255) NOT NULL,
    "location" INTEGER REFERENCES users(id) NOT NULL,
    "date_created" TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS "comments";
CREATE TABLE IF NOT EXISTS "comments"
(
    "id" SERIAL PRIMARY KEY,
    "post_id" INTEGER REFERENCES posts(id) NOT NULL,
    "user_id" INTEGER REFERENCES users(id) NOT NULL,
    "content" TEXT NOT NULL,
    "date_created" TIMESTAMP NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS "messages";
CREATE TABLE IF NOT EXISTS "messages"
(
    "id" SERIAL PRIMARY KEY,
    "user_id_from" INTEGER REFERENCES users(id) NOT NULL,
    "user_id_to" INTEGER REFERENCES users(id) NOT NULL,
    "content" text NOT NULL,
    "date_created" TIMESTAMP NOT NULL DEFAULT NOW()
);
