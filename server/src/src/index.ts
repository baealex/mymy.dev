import express from 'express'
import path from 'path'
import socketio from 'socket.io'

import asyncWrap from './modules/async-wrap'
import logging from './modules/logging'
import useSocket from './socket'

import * as views from './views'

const port = process.env.PORT || 5000

useSocket(new socketio.Server(express()
    .use(logging())
    .use(express.json())
    .use(express.static(path.resolve('client/dist'), { extensions: ['html'] }))
    .post('/api/github/raw', asyncWrap(views.getGitHubRaw))
    .listen(port, () => console.log(`listen on :${port}`))))
