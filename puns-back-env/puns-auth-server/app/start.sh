#!/bin/bash

service="puns-back-auth-server-1.0-SNAPSHOT.jar"
active_profiles="docker"

echo "starting $service"

[ -f $service ] && java -Dspring.profiles.active=$active_profiles -jar $service || echo "$service not found"