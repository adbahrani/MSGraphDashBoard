import { graphLinks } from '../graphHelper'
import { TokenService } from './token'

// TODO: clean up this so token is available  with all calls
export class UsersService {
    public static async getAll() {
        const token = await TokenService.getToken()
        const { value } =
            (await fetch(graphLinks.usersEndGuest, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => response.json())
                .catch(e => alert(e))) || {}

        return value
    }
}
