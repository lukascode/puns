CREATE USER puns_user WITH
LOGIN 
PASSWORD 'puns_user_pass'
NOSUPERUSER
INHERIT
NOCREATEDB
NOCREATEROLE
NOREPLICATION;

GRANT ALL PRIVILEGES ON DATABASE puns_core_database to puns_user;
