FROM baealex/mymydev-base

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
RUN source /root/.cargo/env
ENV PATH="/root/.cargo/bin:$PATH"