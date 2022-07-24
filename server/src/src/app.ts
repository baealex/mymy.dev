import express from 'express'
import path from 'path'

import router from './urls'
import logging from './modules/logging'

export default express()
    .use(logging())
    .use(express.json())
    .use(express.static(path.resolve('client/dist'), { extensions: ['html'] }))
    .use(router)
