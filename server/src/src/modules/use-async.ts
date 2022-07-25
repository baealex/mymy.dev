import {
    Request,
    Response,
    NextFunction,
} from 'express'

export function useAsync(callback: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
    return function (req: Request, res: Response, next: NextFunction) {
        callback(req, res, next)
            .catch((e: Error) => {
                res.status(500).send('Internal Server Error')
                console.log(e)
                next()
            })
    }
}
