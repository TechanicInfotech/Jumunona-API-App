import { Express } from 'express'
import expressLoader from './express'
import mongooseLoader from './mongoose'
import AppLogger from './logger'
import { Connection } from 'mongoose'
import dependencyInjector from './dependencyInjector'

export default async (expressApp: Express): Promise<void> => {
    const mongoDBConnection: Connection = await mongooseLoader()
    AppLogger.info('MongoDB Connected Successfully')

    await dependencyInjector({ mongoDBConnection })

    expressLoader(expressApp)
    AppLogger.info('Express Loaded Successfully')
}
