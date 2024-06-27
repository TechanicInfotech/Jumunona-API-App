import express, { Express, Request, Response } from 'express'
import routes from '../api/routes/index'

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

    app.use(express.json({ limit: '5mb' }))
    app.use(express.urlencoded({ limit: '5mb', extended: true }))

    app.use('/api', routes())
}
