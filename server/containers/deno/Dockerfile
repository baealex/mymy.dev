FROM debian:latest

RUN apt update && apt install -y \
    curl \
    unzip

ENV DENO_INSTALL="/deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

RUN curl -fsSL https://deno.land/x/install/install.sh | sh
