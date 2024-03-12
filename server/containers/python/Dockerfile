FROM baealex/mymydev-base

ENV LANG="C.UTF-8" \
    LC_ALL="C.UTF-8" \
    PATH="/root/.pyenv/shims:/root/.pyenv/bin:$PATH" \
    PYENV_ROOT="/root/.pyenv" \
    PYENV_SHELL="bash"
ENV PYTHON_VERSION=3.12.0
RUN git clone https://github.com/pyenv/pyenv.git $PYENV_ROOT \
    && pyenv install $PYTHON_VERSION \
    && pyenv global $PYTHON_VERSION
ENV PYTHONIOENCODING=utf-8
