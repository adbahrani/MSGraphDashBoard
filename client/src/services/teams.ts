import { graphLinks } from '../graphHelper'
import { BaseService } from './base'

export interface Team {
    id: string
    displayName: string
    mail: string
    visibility: string
}

export interface TeamActivity {
    teamName: string
    lastActivityDate: string
    isDeleted: boolean
    details: [
        {
            activeSharedChannels: number
            activeExternalUsers: number
            reportPeriod: number
            activeUsers: number
            activeChannels: number
            channelMessages: number
            reactions: number
            meetingsOrganized: number
            postMessages: number
            replyMessages: number
            urgentMessages: number
            mentions: number
            guests: number
        }
    ]
}

export class TeamsService extends BaseService {
    public static async getAll(): Promise<Array<Team>> {
        const { value } = await this.httpGet(graphLinks.teams)

        return value
    }

    public static async getActivity(period: 30 | 90): Promise<Array<TeamActivity>> {
        const { value } = await this.httpGet(graphLinks.teamsActivity(period))

        return value
    }
}
