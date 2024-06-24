import mongoose from 'mongoose'
import config from '../config'

export default () => {
    return mongoose.connect(config.mongo.uri)
}
