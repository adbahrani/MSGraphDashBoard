import { TokenService } from './token'

export class BaseService {
    protected static async httpGet(url: string) {
        const token = await TokenService.getToken()
        return fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                ConsistencyLevel: 'eventual',
            },
        }).then(response => response.json())
    }
}
