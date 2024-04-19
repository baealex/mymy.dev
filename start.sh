#!/bin/bash

cd server/src
npx pnpm i

cd client
npx pnpm i

cd ..
npm run build:with && npm run start
