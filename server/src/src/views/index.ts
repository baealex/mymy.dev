import {
    Request,
    Response,
} from 'express'

import axios from 'axios'

export async function getGitHubRaw(req: Request, res: Response) {
    const { raw } = req.body

    const { data } = await axios.request({
        method: 'GET',
        url: encodeURI('https://raw.githubusercontent.com' + raw)
    })

    res.send(data).end()
}
