import { Router } from 'express'
import * as views from './views'
import { useAsync } from './modules/use-async'

export default Router()
    .post('/api/github/raw', useAsync(views.getGitHubRaw))
