import { graphConfig } from '../authConfig'
import { TokenService } from './token'

export class UsersService {
    public static async getAll() {
        const token = await TokenService.getToken()
        const { value } =
            (await fetch(graphConfig.usersEndGuest, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => response.json())
                .catch(e => alert(e))) || {}

        return value
    }
}
