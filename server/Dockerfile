FROM ubuntu:20.04
  
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update

# install Compiler
RUN apt-get install -y \
    gcc g++ build-essential libssl-dev zlib1g-dev libbz2-dev \
    libreadline-dev libsqlite3-dev wget curl llvm \
    libncurses5-dev libncursesw5-dev xz-utils tk-dev \
    libffi-dev liblzma-dev python-openssl git

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
RUN npm i -g typescript

RUN apt-get install -y rustc cargo

ENV LANG="C.UTF-8" \
    LC_ALL="C.UTF-8" \
    PATH="/root/.pyenv/shims:/root/.pyenv/bin:$PATH" \
    PYENV_ROOT="/root/.pyenv" \
    PYENV_SHELL="bash"

ENV PYTHON_VERSION=3.8.5

RUN git clone https://github.com/pyenv/pyenv.git $PYENV_ROOT \
    && pyenv install $PYTHON_VERSION \
    && pyenv global $PYTHON_VERSION

ENV PYTHONIOENCODING=utf-8

COPY ./app/requirements.txt /app/
WORKDIR /app
RUN pip3 install -r requirements.txt

COPY ./app /app

ENTRYPOINT ["python"]
CMD ["app.py"]

# ENTRYPOINT ["uwsgi"]
# CMD ["--socket", ":5000", "--module", "wsgi", "--enable-threads", "-b", "32768"]