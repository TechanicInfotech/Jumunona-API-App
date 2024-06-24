import { Router, Request, Response } from 'express'
import AppLogger from '../../../loaders/logger'
import { Container } from 'typedi'
import {
    AuthenticationService,
    IRegistrationDetails,
} from '../../../services/authentication/AuthenticationService'
import { ResponseWrapper } from '../../responses/ResponseWrapper'

export default (router: Router) => {
    const authenticationService = Container.get(AuthenticationService)

    router.post('/auth/register', async (req: Request, res: Response) => {
        const response = new ResponseWrapper()
        try {
            const registrationDetails: IRegistrationDetails = {
                phoneNumber: req.body.phoneNumber.toString().trim(),
                otp: req.body.otp.toString().trim(),
                password: req.body.password.toString().trim(),
                confirmPassword: req.body.confirmPassword.toString().trim(),
                referralCode: req.body.referralCode.toString().trim(),
            }

            const data =
                await authenticationService.register(registrationDetails)
            response.setData(data)
            await authenticationService.register(registrationDetails)
        } catch (e) {
            response.setError(e.message)
            AppLogger.error(e)
        }
        res.json(response)
    })
}
