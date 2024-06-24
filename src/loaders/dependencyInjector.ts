import { Connection } from 'mongoose'
import { Container } from 'typedi'
import AppLogger from './logger'

export default async ({
    mongoDBConnection,
}: {
    mongoDBConnection: Connection
}): Promise<void> => {
    Container.set('MongoDBConnection', mongoDBConnection)
    ;(await import('../models')).models.forEach((m) => {
        Container.set(m.name, m.model)
    })
    AppLogger.info('✌️ Dependency Injector Loaded')
}
