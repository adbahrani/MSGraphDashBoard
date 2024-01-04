import { TokenService } from './token'
import { Client } from '@microsoft/microsoft-graph-client'

export class BaseService {
    protected static async httpGet(url: string) {
        return fetch(url).then(response => response.json())
    }
}

export const graphClient = Client.init({
    // For supporting beta version
    defaultVersion: 'beta',

    authProvider: async done => {
        const accessToken = await TokenService.getToken()
        done(null, accessToken)
    },
})
