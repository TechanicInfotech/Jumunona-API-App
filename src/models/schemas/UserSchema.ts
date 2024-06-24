import mongoose, { Connection, Schema } from 'mongoose'
import { Container } from 'typedi'

const UserSchema = new Schema({
    details: {
        phoneNumber: { type: String, required: true, unique: true },
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
        referralCode: { type: String, required: true },
        referredAddress: String,
        referralTeam: Array({
            userId: { type: String, required: true },
            phoneNumber: { type: String, required: true },
        }),
    },
})

export interface IUserSchema extends Document {
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
        userid: string
        phoneNumber: string
    }[]
}
export interface IUserDetails {
    phoneNumber: string
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
