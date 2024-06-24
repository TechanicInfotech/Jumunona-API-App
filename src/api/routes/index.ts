import { Router } from 'express'
import authentication from './authentication/authentication'

export default (): Router => {
    const router: Router = Router()

    authentication(router)

    return router
}
