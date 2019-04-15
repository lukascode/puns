FROM ubuntu:16.04

RUN apt-get update
RUN apt-get install -y curl unzip
RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -
RUN apt-get install -y nodejs

COPY puns-live-server.zip /opt

RUN cd /opt && unzip puns-live-server.zip

WORKDIR /opt/puns-live-server

RUN npm install

ENTRYPOINT ["npm", "start"]

EXPOSE 4001