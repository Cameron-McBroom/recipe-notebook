-- uuid plugin
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tables
CREATE TABLE user_account (
                              id uuid DEFAULT uuid_generate_v4(),
                              password VARCHAR NOT NULL ,
                              email VARCHAR NOT NULL ,
                              salt VARCHAR NOT NULL ,
                              PRIMARY KEY(id)
);

CREATE TABLE todo (
                      todo_id uuid DEFAULT uuid_generate_v4() ,
                      description VARCHAR(255) NOT NULL,
                      user_id uuid NOT NULL,
                      PRIMARY KEY (todo_id),
                      CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES user_account(id)
);

-- Configuration for pg-connect-simple
CREATE TABLE "session" (
                           "sid" varchar NOT NULL COLLATE "default",
                           "sess" json NOT NULL,
                           "expire" timestamp(6) NOT NULL
)
    WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

GRANT ALL PRIVILEGES ON TABLE session TO client;
GRANT ALL PRIVILEGES ON TABLE todo TO client;
GRANT ALL PRIVILEGES ON TABLE user_account TO client;
