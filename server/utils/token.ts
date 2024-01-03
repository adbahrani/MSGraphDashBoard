import axios from 'axios'
import { azureConfig } from '../config/azure'

export const fetchToken = async () => {
    const body = {
        client_id: process.env.Client_Id,
        client_secret: process.env.Client_Secret,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
    }
    const formData = Object.entries(body)
        .reduce((acc, [key, value]) => {
            acc.push(`${key}=${encodeURIComponent(value)}`)
            return acc
        }, [])
        .join('&')

    const { data } = await axios.post(
        `https://login.microsoftonline.com/${azureConfig.AzureTenantId}/oauth2/v2.0/token`,
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    return data
}
