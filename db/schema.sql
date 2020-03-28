DROP SCHEMA IF EXISTS "public" CASCADE;
CREATE SCHEMA IF NOT EXISTS "public";

DROP TABLE IF EXISTS "users";
CREATE TABLE IF NOT EXISTS "users"
(
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS "profiles";
CREATE TABLE IF NOT EXISTS "profiles" 
(
    "user_id" INTEGER REFERENCES users(id) NOT NULL PRIMARY KEY,
    "birth_date" TIMESTAMP CHECK (date_part('year', age(birth_date)) >= 13),
    "postal_code" INTEGER NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS "admins";
CREATE TABLE IF NOT EXISTS "admins"
(
    "user_id" INTEGER REFERENCES users(id) NOT NULL PRIMARY KEY
);

DROP TABLE IF EXISTS "profiles_fields";
CREATE TABLE IF NOT EXISTS "profiles_fields"
(
    "user_id" INTEGER REFERENCES users(id) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "value" JSON NOT NULL,
    PRIMARY KEY ("user_id", "name")
);

DROP TABLE IF EXISTS "posts";
CREATE TABLE IF NOT EXISTS "posts"
(
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES users(id) NOT NULL,
    "content"  TEXT CHECK (char_length(content) <= 255) NOT NULL,
    "is_available" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


DROP TABLE IF EXISTS "posts_pictures";
CREATE TABLE IF NOT EXISTS "posts_pictures"
(
    "id" SERIAL PRIMARY KEY,
    "url" VARCHAR(250) NOT NULL,
    "post_id" INTEGER REFERENCES posts(id) NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DROP TABLE IF EXISTS "comments";
CREATE TABLE IF NOT EXISTS "comments"
(
    "id" SERIAL PRIMARY KEY,
    "post_id" INTEGER REFERENCES posts(id) NOT NULL,
    "user_id" INTEGER REFERENCES users(id) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS "messages";
CREATE TABLE IF NOT EXISTS "messages"
(
    "from" INTEGER REFERENCES users(id) NOT NULL,
    "to" INTEGER REFERENCES users(id) NOT NULL,
    "content" text NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("from", "to", "created_at")
);