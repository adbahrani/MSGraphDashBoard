import { graphLinks } from '../graphHelper'
import { BaseService } from './base'

export interface Team {
    id: string
    displayName: string
    description: string
    mail: string
    visibility: string
    webUrl: string
    summary: {
        ownersCount: number
        membersCount: number
        guestsCount: number
    }
}

export interface TeamActivity {
    teamId: string
    teamName: string
    teamType: string
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
    public static async getActivity(period: 30 | 90): Promise<Array<TeamActivity & Team>> {
        const { value: teamsActivity } = await this.httpGet(graphLinks.teamsActivity(period))
        await Promise.all(
            teamsActivity.map((activity: TeamActivity) => this.httpGet(graphLinks.team(activity.teamId)))
        ).then(teamsData =>
            teamsData.forEach((data: Team, index) => {
                teamsActivity[index] = { ...teamsActivity[index], ...data }
            })
        )

        return teamsActivity
    }
}
