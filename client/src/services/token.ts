//TODO: Make this context rather than class
export class TokenService {
    private static token = localStorage.getItem('token') ?? ''

    public static getToken() {
        return this.token
    }

    public static async setToken(tokenValue: string) {
        localStorage.setItem('token', tokenValue)
        this.token = tokenValue
    }

    public static async clearToken() {
        localStorage.removeItem('token')
        this.token = ''
    }
}
