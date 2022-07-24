import axios from 'axios'

import type { Lang } from '../types'

export function getRawSource(raw: string) {
    return axios({
        method: 'POST',
        url: '/api/github/raw',
        data: { raw },
    })
}

export function getSourceResult(lang: Lang, source: string) {
    return axios({
        method: 'POST',
        url: '/api/run/' + lang,
        data: { source },
    })
}