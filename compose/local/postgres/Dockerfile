FROM postgres:14-bullseye

# Install apt packages
RUN apt-get update && apt-get install --no-install-recommends -y \
  # dependencies for building Python packages
  wget


COPY ./compose/local/postgres/maintenance /usr/local/bin/maintenance


RUN chmod +x /usr/local/bin/maintenance/*
RUN mv /usr/local/bin/maintenance/* /usr/local/bin \
    #&& rmdir /local_backups
