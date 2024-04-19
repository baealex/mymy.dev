FROM debian:latest

RUN apt-get update && apt-get install -y \
    gcc \
    curl

ENV CARGO_ROOT=/root/.cargo
ENV PATH="$CARGO_ROOT/bin:$PATH"

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y && \
    source $CARGO_ROOT/env
