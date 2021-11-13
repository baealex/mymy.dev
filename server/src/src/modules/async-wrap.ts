import {
    Request,
    Response,
    NextFunction,
} from 'express';

export default function asyncWrap(callback: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return function (req: Request, res: Response, next: NextFunction) {
        callback(req, res, next)
            .catch((e: Error) => {
                res.status(500).send('Internal Server Error');
                console.log(e);
                next();
            });
    }
}
