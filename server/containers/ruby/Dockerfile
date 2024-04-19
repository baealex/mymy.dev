FROM debian:latest

RUN apt update && apt install -y \
    build-essential \
    libreadline-dev \
    libyaml-dev \
    libffi-dev \
    libssl-dev \
    zlib1g-dev \
    curl \
    git

ENV RUBY_VERSION="3.2.3"
ENV RUBY_CONFIGURE_OPTS="--disable-yjit"
ENV RBENV_ROOT="/rbenv"
ENV PATH="$RBENV_ROOT/bin:$RBENV_ROOT/versions/$RUBY_VERSION/bin:$PATH"

RUN git clone https://github.com/rbenv/rbenv.git $RBENV_ROOT && \
    rbenv init - && \
    git clone https://github.com/rbenv/ruby-build.git $RBENV_ROOT/plugins/ruby-build && \
    rbenv install $RUBY_VERSION --verbose && \
    rbenv global $RUBY_VERSION
