import { TokenService } from './token'
import { Client } from '@microsoft/microsoft-graph-client'

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

export const graphClient = Client.init({
    authProvider: async done => {
        const accessToken = await TokenService.getToken()
        done(null, accessToken)
    },
})
