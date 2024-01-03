import { AuthService } from './auth'
import { TokenService } from './token'
import { Client } from '@microsoft/microsoft-graph-client'

//TODO Move away from this
export class BaseService {
    protected static async httpGet(url: string) {
        const token = await TokenService.getToken()
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                ConsistencyLevel: 'eventual',
            },
        })

        if (!response.ok) {
            if (response.status === 401) {
                baseLogOut(response)
            }
            throw new Error(`Request failed with status ${response.status}`)
        }

        return response.json()
    }
}

const graphClient = Client.init({
    // For supporting beta version
    defaultVersion: 'beta',
    authProvider: async done => {
        try {
            const accessToken = await TokenService.getToken()
            done('Error', accessToken)
        } catch (error) {
            await baseLogOut(error)
            done(error, null)
        }
    },
})

const baseLogOut = async error => {
    TokenService.clearToken()
    await AuthService.logout()
    window.location.href = '/login'
    console.log(error)
}

export async function makeGraphAPICall(endpoint: string, method: string = 'GET', data?: any) {
    try {
        const request = graphClient.api(endpoint)

        if (method === 'GET') {
            return await request.get()
        } else if (method === 'POST') {
            return await request.post(data)
        } // Add support for other HTTP methods as needed

        // Handle other methods or edge cases if necessary
    } catch (error: any) {
        if (error.statusCode === 401) {
            baseLogOut(error)
        } else {
            console.error('Error making Graph API call:', error)
        }
        throw error // Propagate the error up if needed
    }
}
