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
    visibility: string | null,
    createdDateTime: string,
    renewedDateTime: string,
    deletedDateTime: string | null,
    expirationDateTime: string | null,
    owners?: Array<any>,
    members?: Array<any>
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
            'createdDateTime',
            'renewedDateTime',
            'deletedDateTime',
            'expirationDateTime'
        ]
        const { value } = await this.httpGet(`${graphLinks.groups}?$select=${fields.join(',')}`)
        return value
    }

    public static async getAllDeletedGroups(): Promise<Array<Group>> {
        const fields: Array<keyof Group> = [
            'id',
            'displayName',
            'description',
            'visibility',
            'deletedDateTime',
            'expirationDateTime'
        ]
        const { value } = await this.httpGet(`${graphLinks.deletedGroups}?$select=${fields.join(',')}`)
        return value
    }

    public static async getAllGroupByOwnersAndMembers(): Promise<Array<Group>> {
        const allGroups = await this.getAll()

        const allOwners = await Promise.all(allGroups.map(group => this.getOwners(group.id)))
        const allUsers = await Promise.all(allGroups.map(group => this.getMembers(group.id)))
        return allGroups.map((group, index) => ({
            ...group,
            owners: allOwners.at(index),
            members: allUsers.at(index)
        }))
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
