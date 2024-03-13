FROM baealex/mymydev-base

RUN apt install unzip -y

RUN wget https://storage.googleapis.com/dart-archive/channels/stable/release/latest/linux_packages/dart_3.3.1-1_amd64.deb -O /tmp/dart.deb && \
    dpkg -i /tmp/dart.deb && \
    rm /tmp/dart.deb
