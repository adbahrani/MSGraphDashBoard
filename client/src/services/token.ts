import { graphLinks } from '../graphHelper'

//TODO: Make this context rather than class
export class TokenService {
    private static token = localStorage.getItem('token')  ?? ''
    private static expirationDate = new Date(localStorage.getItem('expirationDate') as string) ?? new Date()
    static timeToExpire: number = 60 * 60 * 1000  // 1 hour

    public static async getToken() {
        if (!this.isTokenValid()) {
            this.token = await fetch(graphLinks.token, {
                method: 'GET',
            }).then(response => response.text())
            this.expirationDate = new Date()
            this.expirationDate.setTime(this.expirationDate.getTime() + this.timeToExpire)
            localStorage.setItem('token', this.token)
            localStorage.setItem('expirationDate', this.expirationDate.toDateString())
        }

        return this.token
    }

    private static isTokenValid() {
        console.log(this.token, this.expirationDate.getTime() > Date.now() + 5 * 60 * 1000)
        return this.token && this.expirationDate.getTime() > Date.now() + 5 * 60 * 1000 && !this.token.includes('error')
    }
}
