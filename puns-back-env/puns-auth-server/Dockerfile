FROM java:8
ADD app /opt/puns-auth-server
WORKDIR /opt/puns-auth-server
RUN chmod +x /opt/puns-auth-server/start.sh
ENTRYPOINT ["/opt/puns-auth-server/start.sh"]