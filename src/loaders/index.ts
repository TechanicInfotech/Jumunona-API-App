import { Express } from 'express'
import expressLoader from './express'
import mongooseLoader from './mongoose'
import AppLogger from './logger'

export default async (expressApp: Express): Promise<void> => {
    await mongooseLoader()
    AppLogger.info('MongoDB Connected Successfully')
    expressLoader(expressApp)
    AppLogger.info('Express Loaded Successfully')
}
