#### [PUNS PROJECT] ENVIRONMENT CONFIGURATION

Before starting environment run ./configure.sh

**start environment**

$ docker-compose build && docker-compose up

**remove containers**

$ docker rm $(docker ps -aq)

**remove images**

$ docker rmi $(docker images -q)

**remove dangling images**

$ docker rmi $(docker images -f "dangling=true" -q)
