import { Container, Inject, Service } from 'typedi'
import { UtilsService } from '../UtilsService'
import { IUserSchema } from '../../models/schemas/UserSchema'
import mongoose, { Model } from 'mongoose'
import { CommunicationService } from '../communication/CommunicationService'
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import config from '../../config'

@Service()
export class AuthenticationService {
    constructor(
        @Inject('UserSchema')
        private userSchema: Model<
            IUserSchema & mongoose.Document
        > = Container.get('UserSchema'),
        @Inject()
        private communicationService: CommunicationService,
        @Inject()
        private utilsService: UtilsService
    ) {}
    async register(registrationDetails: IRegistrationDetails) {
        this.validate(registrationDetails)

        const user: IUserSchema | null = await this.userSchema.findOne({
            'details.phone': registrationDetails.phone,
        })
        if (user) throw new Error(Errors.USER_ALREADY_EXISTS)

        const otpVerification: boolean =
            await this.communicationService.verifyOtp(
                `+${registrationDetails.phone}`,
                registrationDetails.otp
            )
        if (!otpVerification) throw new Error(Errors.OTP_VERIFICATION_FAILED)

        const referralCode: string = this.generateReferralCode(
            registrationDetails.phone
        )

        const securedPassword: string = await this.generateSecurePassword(
            registrationDetails.password
        )
        const query: IRegistrationQuery = {
            details: {
                phone: registrationDetails.phone,
            },
            password: securedPassword,
            referral: {
                referralCode: referralCode,
            },
        }
        if (registrationDetails.referralCode) {
            const referredByUser: IUserSchema | null =
                await this.userSchema.findOne({
                    'referral.referralCode': registrationDetails.referralCode,
                })
            if (!referredByUser) throw new Error(Errors.REFERRAL_CODE_INVALID)

            await this.userSchema.updateOne(
                { _id: referredByUser._id },
                {
                    $push: {
                        'referral.referralTeam': {
                            phone: registrationDetails.phone,
                        },
                    },
                }
            )
            query.referral.referredBy = referredByUser.referral.referralCode
        }

        const createdUser: IUserSchema = await this.userSchema.create(query)
        const authToken: string = this.generateAuthToken(createdUser)
        return {
            accessToken: authToken,
        }
    }

    async sendOtp(phone: string) {
        const user: IUserSchema | null = await this.userSchema.findOne({
            'details.phone': phone,
        })

        if (user) throw new Error(Errors.USER_ALREADY_EXISTS)

        const otpVerification = await this.communicationService.sendOtp(
            `+${phone}`
        )
        if (!otpVerification) throw new Error(Errors.OTP_VERIFICATION_FAILED)

        return {
            message: `OTP Sent Successfully`,
        }
    }

    private validate(dataFields: IRegistrationDetails): void {
        if (dataFields.phone === '') throw new Error(Errors.PHONE_EMPTY)
        if (!this.utilsService.isNumeric(dataFields.phone))
            throw new Error(Errors.PHONE_NOT_NUMERIC)
        if (dataFields.otp.length !== 6) throw new Error(Errors.OTP_LENGTH)
        if (!this.utilsService.isNumeric(dataFields.otp))
            throw new Error(Errors.OTP_NOT_NUMERIC)
        if (
            dataFields.password.length < 8 ||
            dataFields.confirmPassword.length < 8
        )
            throw new Error(Errors.PASSWORD_LENGTH)
        if (dataFields.password !== dataFields.confirmPassword)
            throw new Error(Errors.PASSWORD_CONFIRM_PASSWORD_MISMATCH)
        if (dataFields.referralCode && dataFields.referralCode.length < 7)
            throw new Error(Errors.REFERRAL_CODE_LENGTH)
        if (
            dataFields.referralCode &&
            !this.utilsService.isNumeric(dataFields.referralCode)
        )
            throw new Error(Errors.REFERRAL_CODE_NOT_NUMERIC)
    }

    private async generateSecurePassword(password: string): Promise<string> {
        const salt: string = await bcrypt.genSalt(10)
        return bcrypt.hash(password, salt)
    }

    private generateReferralCode(phone: string): string {
        return (parseInt(phone) % 10000000).toString()
    }

    private generateAuthToken(user: IUserSchema) {
        return jwt.sign({ id: user._id }, config.auth.jwtSecret, {
            expiresIn: '1y',
        })
    }
}

export interface IRegistrationDetails {
    phone: string
    otp: string
    password: string
    confirmPassword: string
    referralCode?: string
}

interface IRegistrationQuery {
    details: { phone: string }
    password: string
    referral: {
        referralCode: string
        referredBy?: string
    }
}

enum Errors {
    PHONE_EMPTY = 'Phone Number Cannot Be Empty',
    PHONE_NOT_NUMERIC = 'Phone Number can only contain numeric values',
    OTP_LENGTH = 'OTP should be of 6 digits in length',
    OTP_NOT_NUMERIC = 'OTP can only contain numeric values',
    PASSWORD_LENGTH = 'Password should be minimum 8 characters long',
    PASSWORD_CONFIRM_PASSWORD_MISMATCH = 'Password and Confirm Password should be same',
    REFERRAL_CODE_LENGTH = 'Referral Code should be 7 characters in length',
    REFERRAL_CODE_NOT_NUMERIC = 'Referral Code should be numeric only',
    USER_ALREADY_EXISTS = 'User Already Exists',
    OTP_VERIFICATION_FAILED = 'OTP Verification Failed',
    REFERRAL_CODE_INVALID = 'Referral Code is Invalid',
}
