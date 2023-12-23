import { graphLinks } from '../graphHelper'

//TODO: Make this context rather than class
export class TokenService {
    private static token = localStorage.getItem('token') ?? ''
    private static expirationDate = new Date(localStorage.getItem('expirationDate') as string) ?? new Date()
    static timeToExpire: number = 60 * 60 * 1000 - 100 // 1 hour - 100ms buffer

    public static async getToken() {
        //console.log('Valid Token', this.expirationDate.getTime() > Date.now())
        if (!this.isTokenValid()) {
            this.token = await fetch(graphLinks.token, {
                method: 'GET',
            }).then(response => response.text())
            this.expirationDate = new Date()
            this.expirationDate.setTime(this.expirationDate.getTime() + this.timeToExpire)
            localStorage.setItem('token', this.token)
            localStorage.setItem('expirationDate', this.expirationDate.toString())
        }

        return this.token
    }

    private static isTokenValid() {
        return this.token && this.expirationDate.getTime() > Date.now() && !this.token.includes('error')
    }
}
