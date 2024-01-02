import { graphLinks } from '../graphHelper'
import { TokenService } from './token'

//TODO: Make this context rather than class
export class AuthService {
    public static async login({
        email,
        password
    }: { email: string, password: string }) {

        const response = await fetch(graphLinks.login, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        if (response.ok) {
            await TokenService.getToken()
            return;
        }
        throw new Error('Something went wrong while logging in, please try again')
    }

    public static async signUp({
        email,
        password,
        firstName,
        lastName
    }: { email: string, password: string, firstName: string, lastName: string }) {

        const response = await fetch(graphLinks.signup, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                firstName,
                lastName
            })
        })
        if (response.ok) {
            await TokenService.getToken()
            return;
        }
        throw new Error('Something went wrong while signing up, please try again')
    }
}