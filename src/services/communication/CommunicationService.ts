import { Service } from 'typedi'
import twilio, { Twilio } from 'twilio'
import config from '../../config'
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification'
import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck'

@Service()
export class CommunicationService {
    private twilioClient: Twilio = twilio(
        config.messaging.twilio.accountSid,
        config.messaging.twilio.authToken
    )

    async sendOtp(phone: string): Promise<boolean> {
        const verificationInstance: VerificationInstance =
            await this.twilioClient.verify.v2
                .services(config.messaging.twilio.verificationId)
                .verifications.create({
                    to: `+${phone}`,
                    channel: 'sms',
                    locale: 'ru',
                })
        switch (verificationInstance.status) {
            case 'approved':
                return true
            case 'failed':
                return false
            case 'pending':
                return true
            default:
                throw new Error(Errors.OTP_SENDING_PENDING)
        }
    }

    async verifyOtp(phone: string, otp: string): Promise<boolean> {
        let status: boolean = false
        const verificationCheckInstance: VerificationCheckInstance =
            await this.twilioClient.verify.v2
                .services(config.messaging.twilio.verificationId)
                .verificationChecks.create({ to: phone, code: otp })

        if (verificationCheckInstance.status === 'approved') status = true
        else throw new Error(Errors.OTP_MISMATCH)
        return status
    }
}

enum Errors {
    OTP_VERIFICATION_PENDING = 'OTP Verification Pending for Some Unknown Reason, Retry',
    OTP_SENDING_PENDING = 'OTP Sending Process is Pending for Some Unknown Reason',
    OTP_MISMATCH = 'OTP is not matched',
}
