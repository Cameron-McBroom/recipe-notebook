-- uuid plugin
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configuration for pg-connect-simple
CREATE TABLE "session"
(
    "sid"    varchar      NOT NULL COLLATE "default",
    "sess"   json         NOT NULL,
    "expire" timestamp(6) NOT NULL
)
    WITH (OIDS= FALSE);

ALTER TABLE "session"
    ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- Tables
CREATE TABLE user_account
(
    id         uuid DEFAULT uuid_generate_v4(),
    password   VARCHAR NOT NULL,
    email      VARCHAR NOT NULL,
    salt       VARCHAR NOT NULL,
    first_name VARCHAR(255),
    last_name  VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE recipe
(
    id               uuid DEFAULT uuid_generate_v4(),
    user_id          uuid NOT NULL,
    rating           INTEGER,
    title            VARCHAR(255),
    num_ratings      INTEGER,
    difficulty_score INTEGER,
    servings         INTEGER,
    minutes          INTEGER,
    directions       VARCHAR,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user_account (id)
);

CREATE TABLE note
(
    id        uuid DEFAULT uuid_generate_v4(),
    recipe_id uuid,
    user_id   uuid,
    content   VARCHAR,
    PRIMARY KEY (id),
    FOREIGN KEY (recipe_id) REFERENCES recipe (id),
    FOREIGN KEY (user_id) REFERENCES user_account (id)
);

CREATE TABLE ingredient
(
    id        uuid DEFAULT uuid_generate_v4(),
    name      VARCHAR(255),
    user_id   uuid,
    recipe_id uuid,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user_account (id),
    FOREIGN KEY (recipe_id) REFERENCES recipe (id)
);

CREATE TABLE recipe_category
(
    id        uuid DEFAULT uuid_generate_v4(),
    name      VARCHAR(255),
    user_id   uuid,
    recipe_id uuid,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user_account (id),
    FOREIGN KEY (recipe_id) REFERENCES recipe (id)
);

CREATE TABLE shared_recipe
(
    user_id   uuid NOT NULL,
    recipe_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_account (id),
    FOREIGN KEY (recipe_id) REFERENCES recipe (id)
);
