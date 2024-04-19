FROM debian:latest

RUN apt update && apt install -y \
    curl \
    unzip

ENV DART_INSTALLER_PATH="/tmp/dart.deb"

RUN curl -o $DART_INSTALLER_PATH https://storage.googleapis.com/dart-archive/channels/stable/release/latest/linux_packages/dart_3.3.4-1_amd64.deb && \
    dpkg -i $DART_INSTALLER_PATH && \
    rm $DART_INSTALLER_PATH
