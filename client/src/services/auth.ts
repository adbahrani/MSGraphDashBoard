import { graphLinks } from '../graphHelper'
import { TokenService } from './token'

export class AuthService {
    public static async login({ email, password }: { email: string; password: string }) {
        const response = await fetch(graphLinks.login, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.ok) {
            await TokenService.getToken()
            return
        } else {
            const errorMessage = (await response.json())?.message || (await response.text())
            throw new Error(errorMessage)
        }
    }

    public static async signUp({
        email,
        password,
        firstName,
        lastName,
    }: {
        email: string
        password: string
        firstName: string
        lastName: string
    }) {
        const response = await fetch(graphLinks.signup, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                firstName,
                lastName,
            }),
        })
        if (response.ok) {
            await TokenService.getToken()
            return
        } else {
            const errorMessage = (await response.json())?.message || (await response.text())
            throw new Error(errorMessage)
        }
    }
}
