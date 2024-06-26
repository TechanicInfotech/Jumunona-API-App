import dotenv from 'dotenv'
import * as process from 'process'

const envFound = dotenv.config()

if (!envFound) throw new Error(' ⚠️ No Environment Variable File Found ⚠️ ')

export default {
    port: parseInt(process.env.PORT || '5000', 10) || 5000,
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'testSecret',
    },
    backend: {
        baseUrl: process.env.BACKEND_BASE_URL || 'https://api.jumunona.com',
    },
    mongo: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
    },
    aws: {
        s3: {
            bucketName: process.env.AWS_S3_BUCKET_NAME || 'test',
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || 'test',
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || 'test',
            region: process.env.AWS_S3_REGION || 'test',
        },
    },
    messaging: {
        twilio: {
            authToken: process.env.TWILIO_AUTH_TOKEN || 'test',
            verificationId: process.env.TWILIO_VERIFICATION_ID || 'test',
            accountSid: process.env.TWILIO_ACCOUNT_SID || 'test',
        },
    },
    payment: {
        dc: {
            paymentGatewayUrl: process.env.DC_PAYMENT_GATEWAY_URL || 'test',
            paymentGatewayVerificationUrl:
                process.env.DC_PAYMENT_GATEWAY_VERIFICATION_URL || 'test',
            merchantId: process.env.DC_MERCHANT_ID || 'test',
            secretKey: process.env.DC_SECRET_KEY || 'test',
            account: process.env.DC_ACCOUNT || 'test',
            articul: process.env.DC_ARTICUL || 'test',
        },
    },
}
