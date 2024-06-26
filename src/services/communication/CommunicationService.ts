import { Service } from 'typedi'
import twilio, { Twilio } from 'twilio'
import config from '../../config'
import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck'

@Service()
export class CommunicationService {
    private twilioClient: Twilio = twilio(
        config.messaging.twilio.accountSid,
        config.messaging.twilio.authToken
    )

    async verifyOtp(phone: string, otp: string): Promise<boolean> {
        const verificationInstance: VerificationCheckInstance =
            await this.twilioClient.verify.v2
                .services(config.messaging.twilio.verificationId)
                .verificationChecks.create({ to: phone, code: otp })

        switch (verificationInstance.status) {
            case 'approved':
                return true
            case 'failed':
                return false
            default:
                throw new Error(Errors.OTP_VERIFICATION_PENDING)
        }
    }
}

enum Errors {
    OTP_VERIFICATION_PENDING = 'OTP Verification Pending for Some Unknown Reason, Retry',
}
