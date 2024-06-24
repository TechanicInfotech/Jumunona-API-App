import express, { Express } from 'express'
import config from './config'
import appLoader from './loaders/index'
import AppLogger from './loaders/logger'

async function startServer() {
    const app: Express = express()
    await appLoader(app)

    return app.listen(config.port, () => {
        AppLogger.info(`
        **********************************
               Jumunona API
        **********************************
        👌 Server Listening on Port: ${config.port}
        👌 DB Connection URI: ${config.mongo.uri},
        **********************************
        `)
    })
}

startServer()
    .then(() => {
        AppLogger.info(`Server Started`)
    })
    .catch((e) => {
        AppLogger.error(`Server Failed to Start because${e.stack}`)
    })
