FROM mongo:4.1

ADD initdb /docker-entrypoint-initdb.d

ENV MONGO_INITDB_ROOT_USERNAME root
ENV MONGO_INITDB_ROOT_PASSWORD liv3R00t

ENV MONGO_INITDB_DATABASE puns_live_db

EXPOSE 27017

CMD [ "mongod", "--port", "27017"]