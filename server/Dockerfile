FROM baealex/mymydev-base
  
WORKDIR /app

COPY ./src/package.json ./
COPY ./src/package-lock.json ./
COPY ./src/client/package.json ./client/

RUN npm i

COPY ./src/ ./

ENTRYPOINT ["npm", "run"]
CMD ["start"]
