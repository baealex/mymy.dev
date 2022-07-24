import {
    Request,
    Response,
} from 'express'

import axios from 'axios'

export async function getGitHubRaw(req: Request, res: Response) {
    const { raw } = req.body

    if (!raw) {
        res.status(404).send('Not Found').end()
        return
    }

    const { data } = await axios.request({
        method: 'GET',
        url: encodeURI('https://raw.githubusercontent.com' + raw)
    })
    
    res.send(data).end()
}
