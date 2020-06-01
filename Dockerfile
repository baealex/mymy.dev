# Dockerfile

FROM ubuntu:latest
COPY . /coding-doumi
WORKDIR /coding-doumi
RUN apt-get update

# install Compiler
RUN apt-get install -y build-essential
RUN apt-get install -y gcc
RUN apt-get install -y g++
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

RUN apt-get install -y python3-pip python3-dev
RUN pip3 install -r requirements.txt
ENTRYPOINT ["python3"]
CMD ["app.py"]