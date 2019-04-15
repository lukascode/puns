FROM postgres:9.6
RUN localedef -i pl_PL -c -f UTF-8 -A /usr/share/locale/locale.alias pl_PL.UTF-8
ENV LANG pl_PL.UTF-8
ENV POSTGRES_DB puns_core_database
COPY initdb /docker-entrypoint-initdb.d