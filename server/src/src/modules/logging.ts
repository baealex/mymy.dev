import {
    Request,
    Response,
    NextFunction,
} from 'express'

export default function logging() {
    return function (req: Request, res: Response, next: NextFunction) {
        const { method, url } = req;
        const userAddress = req.headers['x-forwarded-for']
            || req.connection.remoteAddress
            || ''
        const date   = new Date()
        const year   = date.getFullYear()
        const month  = ('0' + (date.getMonth() + 1)).slice(-2)
        const day    = ('0' + date.getDate()).slice(-2)
        const hour   = ('0' + date.getHours()).slice(-2)
        const minute = ('0' + date.getMinutes()).slice(-2)
        const secend = ('0' + date.getSeconds()).slice(-2)
        console.log(
            `${year}/${month}/${day} ` +
            `${hour}:${minute}:${secend} ` + 
            `${method} ${url} ${userAddress}`
        )
        next()
    }
}