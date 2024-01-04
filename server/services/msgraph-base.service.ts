import axios from 'axios'

export class MsGraphBaseService {
    async httpGet(url: string, token: string) {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                ConsistencyLevel: 'eventual',
            },
        })
        return response.data
    }
}
