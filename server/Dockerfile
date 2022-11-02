FROM baealex/mymydev-base
  
WORKDIR /app

COPY ./src/package.json ./
COPY ./src/package-lock.json ./
COPY ./src/client/package.json ./client/

RUN npm i

COPY ./src/ ./

RUN npm run build
RUN npm run build:client

ENTRYPOINT ["npm", "run"]
CMD ["start"]
