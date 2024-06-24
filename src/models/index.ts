import mongoose from 'mongoose'
import UserSchema from './schemas/UserSchema'

export const models: Array<{
    name: string
    model: mongoose.Model<mongoose.Document>
}> = [UserSchema]
