import { Express, Request, Response } from 'express'

export default (app: Express): void => {
    /*
    Health Check
    */

    app.get('/health', async (req: Request, res: Response) => {
        res.status(200).end()
    })

    app.head('/health', async (req: Request, res: Response) => {
        res.status(200).end()
    })
}
