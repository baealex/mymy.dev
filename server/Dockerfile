FROM ubuntu:latest
RUN apt-get update

# install Compiler
RUN apt-get install -y build-essential
RUN apt-get install -y gcc
RUN apt-get install -y g++
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y rustc cargo
RUN apt-get install -y python3-pip python3-dev

COPY ./app/requirements.txt /app/
WORKDIR /app
RUN pip3 install -r requirements.txt

COPY ./app /app

ENTRYPOINT ["uwsgi"]
CMD ["--socket", ":5000", "--module", "wsgi", "--enable-threads", "-b", "32768"]