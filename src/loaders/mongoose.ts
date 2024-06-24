import mongoose, { Connection } from 'mongoose'
import config from '../config'

export default async (): Promise<Connection> => {
    await mongoose.connect(config.mongo.uri)
    return mongoose.connection
}
