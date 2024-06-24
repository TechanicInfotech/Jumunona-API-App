import express from 'express'
import config from './config'

async function startServer() {
    const app = express()

    return app.listen(config.port, () => {})
}

startServer()
    .then(() => {
        console.log(`Server Started`)
    })
    .catch((e) => {
        console.log(`Server Failed to Start because of this`, e)
    })
