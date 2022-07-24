import { Router } from 'express'
import * as views from './views'

import asyncWrap from './modules/async-wrap'

export default Router()
    .post('/api/github/raw', asyncWrap(views.getGitHubRaw))
