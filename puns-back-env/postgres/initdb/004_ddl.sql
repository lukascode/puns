CREATE TABLE puns_core.game_scores (
  id              BIGSERIAL NOT NULL, 
  player_id       int8 NOT NULL, 
  points          int4 NOT NULL, 
  game_room_id    VARCHAR(256), 
  event_timestamp timestamp, 
  guessed_word_id int8 NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE puns_core.game_words (
  id   BIGSERIAL NOT NULL, 
  word varchar(64) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE puns_core.media (
  id            uuid NOT NULL, 
  file_name     varchar(2048) NOT NULL, 
  storage_path  varchar(2048), 
  is_used boolean NOT NULL DEFAULT TRUE,
  creation_time timestamp NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE puns_core.players (
  id              BIGSERIAL NOT NULL, 
  email           varchar(255) NOT NULL UNIQUE, 
  nick            varchar(255) NOT NULL UNIQUE, 
  password        varchar(255) NOT NULL, 
  active          bool NOT NULL, 
  avatar_media_id uuid, 
  role            text NOT NULL, 
  creation_time   timestamp NOT NULL, 
  PRIMARY KEY (id));
CREATE EXTENSION "uuid-ossp";
CREATE SEQUENCE puns_core.hibernate_sequence;
ALTER TABLE puns_core.game_scores ADD CONSTRAINT "player guess word" FOREIGN KEY (guessed_word_id) REFERENCES puns_core.game_words (id);
ALTER TABLE puns_core.players ADD CONSTRAINT "player has avatar" FOREIGN KEY (avatar_media_id) REFERENCES puns_core.media (id);
ALTER TABLE puns_core.game_scores ADD CONSTRAINT "player scores points" FOREIGN KEY (player_id) REFERENCES puns_core.players (id);
