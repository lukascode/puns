FROM java:8
ADD app /opt/puns-core-api
WORKDIR /opt/puns-core-api
RUN chmod +x /opt/puns-core-api/start.sh
ENTRYPOINT ["/opt/puns-core-api/start.sh"]