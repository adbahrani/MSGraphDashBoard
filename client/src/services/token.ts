import { graphLinks } from '../graphHelper'

//TODO: Make this context rather than class
export class TokenService {
    private static token = localStorage.getItem('token') ?? ''

    public static async fetcTokenFromApi() {
        const tokenResponse = await fetch(graphLinks.token)
        if (tokenResponse.ok) {
            const tokenData = await tokenResponse.text()
            return tokenData
        }
        throw new Error('Something went wrong while fetching token')
    }

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
