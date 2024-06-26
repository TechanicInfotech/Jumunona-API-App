import { Router, Request, Response } from 'express'
import AppLogger from '../../../loaders/logger'
import { Container } from 'typedi'
import {
    AuthenticationService,
    IRegistrationDetails,
} from '../../../services/authentication/AuthenticationService'
import { ResponseWrapper } from '../../responses/ResponseWrapper'
import { IRegisterResponse } from '../../responses/authentication'

export default (router: Router) => {
    const authenticationService = Container.get(AuthenticationService)

    router.post('/auth/register', async (req: Request, res: Response) => {
        const response = new ResponseWrapper<IRegisterResponse>()
        try {
            const registrationDetails: IRegistrationDetails = {
                phone: req.body.phone.toString().trim(),
                otp: req.body.otp.toString().trim(),
                password: req.body.password.toString().trim(),
                confirmPassword: req.body.confirmPassword.toString().trim(),
                referralCode: req.body.referralCode.toString().trim(),
            }

            const data: IRegisterResponse =
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
