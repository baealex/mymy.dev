import type { Request, Response } from 'express'

export function home(req: Request, res: Response) {
    res.send('Hello, My Express JS!\n').end()
}
