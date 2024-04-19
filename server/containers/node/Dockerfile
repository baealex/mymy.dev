FROM debian:latest

RUN apt update && apt install -y \
    curl

ENV NODE_VERSION 21.7.3
ENV NVM_DIR="/nvm"
ENV NVM_INSTALL="$NVM_DIR/versions/node/v$NODE_VERSION"
ENV PATH="$NVM_INSTALL/bin:$PATH"

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN mkdir -p $NVM_DIR && \
    curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash && \
    source $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default
