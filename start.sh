#!/bin/bash

docker pull baealex/mymydev-env-cpp && \
docker pull baealex/mymydev-env-dart && \
docker pull baealex/mymydev-env-deno && \
docker pull baealex/mymydev-env-node && \
docker pull baealex/mymydev-env-python && \
docker pull baealex/mymydev-env-ruby && \
docker pull baealex/mymydev-env-rust

cd server/src
npx pnpm i

cd client
npx pnpm i

cd ..
npm run build:with && npm run start
