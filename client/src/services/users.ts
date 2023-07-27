import { graphLinks } from '../graphHelper'
import { TokenService } from './token'

export interface User {
    id: string
    userPrincipalName: string
    jobTitle: string
    department: string | null
    officeLocation: string | null
    assignedLicenses: Array<{ skuId: string }>
    userType: string
    usageLocation: string
    accountEnabled: boolean
    state: string
}

export class UsersService {
    private static async httpGet(url: string) {
        const token = await TokenService.getToken()
        return fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                ConsistencyLevel: 'eventual',
            },
        }).then(response => response.json())
    }

    public static async getAll(): Promise<Array<User>> {
        const fields: Array<keyof User> = [
            'id',
            'userPrincipalName',
            'jobTitle',
            'department',
            'officeLocation',
            'assignedLicenses',
            'userType',
            'usageLocation',
            'accountEnabled',
            'state',
        ]
        const { value } = await this.httpGet(
            `${graphLinks.users}?$select=${fields.join(',')}`
        )

        return value
    }

    public static async getDeletedUsersCount() {
        //
        /**
         * There is a deletionTimestamp property in the User entity
         * But it can't be used as it will always return null
         * https://learn.microsoft.com/en-us/previous-versions/azure/ad/graph/api/entity-and-complex-type-reference#user-entity
         * We need to get the count through the directory endpoint
         */
        const deletedUsers = await this.httpGet(
            `${graphLinks.deletedUsers}?&$count=true&$top=1`
        )

        return deletedUsers['@odata.count']
    }
}
