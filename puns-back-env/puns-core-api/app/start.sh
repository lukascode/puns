#!/bin/bash

service="puns-back-core-1.0-SNAPSHOT-exec.jar"
active_profiles="docker"

echo "starting $service $HOME"
[ -f $service ] && java -Dspring.profiles.active=$active_profiles -jar $service || echo "$service not found"
