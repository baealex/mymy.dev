import express from 'express'
import path from 'path'

import asyncWrap from './modules/async-wrap'
import logging from './modules/logging'

import * as views from './views'

const port = process.env.PORT || 5000

express()
    .use(logging())
    .use(express.json())
    .use(express.static(path.resolve('client/dist'), {
        extensions: ['html']
    }))
    .post('/api/github/raw', asyncWrap(views.getGitHubRaw))
    .post('/api/run/:language', asyncWrap(views.runLanguage))
    .listen(port, () => console.log(`listen on :${port}`))
