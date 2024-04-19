FROM debian:latest

RUN apt update && apt install -y \
    build-essential \
    libreadline-dev \
    libssl-dev \
    zlib1g-dev \
    curl \
    git

ENV PYTHON_VERSION=3.12.0
ENV PYTHONIOENCODING=utf-8
ENV PYENV_ROOT="/pyenv"
ENV PYENV_SHELL="bash"
ENV PATH="$PYENV_ROOT/shims:$PYENV_ROOT/bin:$PATH"

RUN git clone https://github.com/pyenv/pyenv.git $PYENV_ROOT && \
    pyenv install $PYTHON_VERSION --verbose && \
    pyenv global $PYTHON_VERSION
