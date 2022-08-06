import { Router } from 'express'
import * as views from '~/views'

export default Router()
    .post('/api/github/raw', views.getGitHubRaw)
