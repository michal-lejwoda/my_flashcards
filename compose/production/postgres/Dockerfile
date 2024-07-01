FROM postgres:16-bullseye

# Install apt packages
RUN apt-get update && apt-get install --no-install-recommends -y \
  # dependencies for building Python packages
  wget


COPY ./compose/production/postgres/maintenance /usr/production/bin/maintenance

ENV PATH="/usr/production/bin:${PATH}"
RUN chmod +x /usr/production/bin/maintenance/*
RUN mv /usr/production/bin/maintenance/* /usr/production/bin \
    && rmdir /usr/production/bin/maintenance
RUN mkdir -p /prod_backups
