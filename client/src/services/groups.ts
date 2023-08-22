import { graphLinks } from '../graphHelper'
import { BaseService } from './base'
import { User } from './users'

export interface Group {
    id: string
    displayName: string
    description: string
    mailEnabled: boolean
    securityEnabled: boolean
    groupTypes: Array<string>
    resourceProvisioningOptions: Array<string>
    visibility: string | null
}

export class GroupsService extends BaseService {
    public static async getAll(): Promise<Array<Group>> {
        const fields: Array<keyof Group> = [
            'id',
            'displayName',
            'description',
            'mailEnabled',
            'securityEnabled',
            'groupTypes',
            'resourceProvisioningOptions',
            'visibility',
        ]
        const { value } = await this.httpGet(`${graphLinks.groups}?$select=${fields.join(',')}`)

        return value
    }

    public static async getMembers(id: string): Promise<Array<User>> {
        const fields: Array<keyof User> = ['userPrincipalName', 'jobTitle', 'officeLocation']
        const { value } = await this.httpGet(`${graphLinks.groupMembers(id)}?$select=${fields.join(',')}`)

        return value
    }

    public static async getOwners(id: string): Promise<Array<User>> {
        const fields: Array<keyof User> = ['userPrincipalName', 'jobTitle', 'officeLocation']
        const { value } = await this.httpGet(`${graphLinks.groupOwners(id)}?$select=${fields.join(',')}`)

        return value
    }
}
