import { Service } from 'typedi'

@Service()
export class UtilsService {
    isNumeric(value: string) {
        return /^\d+$/.test(value)
    }
}
