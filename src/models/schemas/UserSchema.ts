import mongoose, { Connection, Schema } from 'mongoose'
import { Container } from 'typedi'

const UserSchema = new Schema({
    details: {
        phone: { type: String, required: true, unique: true },
        name: String,
        email: String,
        gender: String,
        dob: Date,
        profileImage: String,
    },
    password: { type: String, required: true },
    defaultAddress: String,
    firebaseToken: String,
    referral: {
        referralCode: { type: String, required: true, unique: true },
        referredBy: String,
        referralTeam: Array({
            phone: { type: String, required: true },
            userId: { type: mongoose.Types.ObjectId, required: true },
        }),
    },
})

export interface IUserSchema extends Document {
    _id: mongoose.Types.ObjectId
    details: IUserDetails
    password: string
    defaultAddress?: string
    firebaseToken?: string
    referral: IUserReferral
}
export interface IUserReferral {
    referralCode: string
    referredBy?: string
    referralTeam?: {
        userId: string
        phone: string
    }[]
}
export interface IUserDetails {
    phone: string
    name?: string
    email?: string
    gender?: string
    dob?: Date
    profileImage?: string
}

export default {
    name: 'UserSchema',
    model: Container.get<Connection>(
        'MongoDBConnection'
    ).model<mongoose.Document>('User', UserSchema, 'users'),
}
