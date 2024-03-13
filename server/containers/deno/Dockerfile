FROM baealex/mymydev-base

RUN apt install unzip -y

RUN curl -fsSL https://deno.land/x/install/install.sh | sh
ENV DENO_INSTALL="/root/.deno" \
    PATH="/root/.deno/bin:$PATH"
