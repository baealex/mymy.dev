FROM baealex/mymydev-base

RUN apt install libyaml-dev -y

ENV PATH="/root/.rbenv/bin:$PATH" \
    RBENV_ROOT="/root/.rbenv"
RUN git clone https://github.com/rbenv/rbenv.git $RBENV_ROOT
RUN rbenv init -
ENV RUBY_VERSION=3.2.3 \
    RUBY_CONFIGURE_OPTS="--disable-yjit"
RUN git clone https://github.com/rbenv/ruby-build.git $RBENV_ROOT/plugins/ruby-build \
    && rbenv install $RUBY_VERSION --verbose \
    && rbenv global $RUBY_VERSION
ENV PATH="/root/.rbenv/versions/$RUBY_VERSION/bin:$PATH"