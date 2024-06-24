export class ResponseWrapper<T> {
    success: boolean
    data?: T
    errors?: Array<Error>

    constructor() {
        this.success = false
    }

    setData(data: T) {
        this.data = data
        this.success = true
    }

    setError(error: Error) {
        this.errors = [error]
        this.success = false
    }
}
