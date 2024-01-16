import { TokenService } from './token'
import { Client } from '@microsoft/microsoft-graph-client'

//TODO Move away from this
export class BaseService {
    protected static async httpGet(url: string, isRetried = false) {
        const token = await TokenService.getToken()
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                ConsistencyLevel: 'eventual',
            },
        })

        if (!response.ok) {
            if (!isRetried && response.status === 401) {
                await refreshToken()
                return this.httpGet(url, true)
            } else {
                throw new Error(`Request failed with status ${response.status}`)
            }
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
            const newToken = await refreshToken()
            done(error, newToken)
        }
    },
})

const refreshToken = async () => {
    const newToken = await TokenService.fetcTokenFromApi()
    TokenService.setToken(newToken)
    return newToken
}

export async function makeGraphAPICall(
    endpoint: string,
    method: string = 'GET',
    data?: any,
    options?: {
        version?: 'v1.0' | 'beta'
        isRetried?: boolean
    }
) {
    const { version = 'beta', isRetried = false } = options || {}
    try {
        const request = graphClient.api(endpoint).version(version)

        if (method === 'GET') {
            return await request.get()
        } else if (method === 'POST') {
            return await request.post(data)
        } // Add support for other HTTP methods as needed

        // Handle other methods or edge cases if necessary
    } catch (error: any) {
        if (!isRetried && error.statusCode === 401) {
            await refreshToken()
            return makeGraphAPICall(endpoint, method, data, {
                ...options,
                isRetried: true,
            })
        } else {
            console.error('Error making Graph API call:', error)
        }
        throw error // Propagate the error up if needed
    }
}
