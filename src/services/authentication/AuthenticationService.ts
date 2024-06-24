import { Service } from 'typedi'
import { UtilsService } from '../UtilsService'

@Service()
export class AuthenticationService {
    constructor(private utilsService: UtilsService) {}
    async register(registrationDetails: IRegistrationDetails) {
        this.validate(registrationDetails)
    }

    private validate(dataFields: IRegistrationDetails): void {
        if (dataFields.phoneNumber === '')
            throw new Error(Errors.PHONE_NUMBER_EMPTY)
        if (!this.utilsService.isNumeric(dataFields.phoneNumber))
            throw new Error(Errors.PHONE_NUMBER_NOT_NUMERIC)
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
            this.utilsService.isNumeric(dataFields.referralCode)
        )
            throw new Error(Errors.REFERRAL_CODE_NOT_NUMERIC)
    }
}

export interface IRegistrationDetails {
    phoneNumber: string
    otp: string
    password: string
    confirmPassword: string
    referralCode?: string
}

enum Errors {
    PHONE_NUMBER_EMPTY = 'Phone Number Cannot Be Empty',
    PHONE_NUMBER_NOT_NUMERIC = 'Phone Number can only contain numeric values',
    OTP_LENGTH = 'OTP should be of 6 digits in length',
    OTP_NOT_NUMERIC = 'OTP can only contain numeric values',
    PASSWORD_LENGTH = 'Password should be minimum 8 characters long',
    PASSWORD_CONFIRM_PASSWORD_MISMATCH = 'Password and Confirm Password should be same',
    REFERRAL_CODE_LENGTH = 'Referral Code should be 7 characters in length',
    REFERRAL_CODE_NOT_NUMERIC = 'Referral Code should be numeric only',
}
