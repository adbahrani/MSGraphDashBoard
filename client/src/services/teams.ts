import { graphLinks } from '../graphHelper'
import { BaseService, graphClient } from './base'
import { ActivityType, DriveItem, Team } from '@microsoft/microsoft-graph-types'

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
    public static async getFileChangesByTeams() {
        try {
            const teams = await graphClient.api('/teams').get()
            for (const team of teams.value) {
                const driveItems = await graphClient.api(`/groups/${team.id}/drive/root/children`).get()
                console.log(`Team: ${team.displayName}, File Count: ${driveItems.value.length}`)
                console.log(driveItems)
            }
        } catch (error: any) {
            console.error('Error fetching files:', error.message)
        }
    }

    // Fetch file activities for each team
    // Fetch file activities for each team
    public static async getFileActivitiesByTeams(activityType: string = 'modify') {
        try {
            const teams = await graphClient.api('/teams').get()

            //teams.value.map(team => console.log(team.displayName,team.id))
            const teamPromises = teams.value.map(team =>
                graphClient.api(`/groups/${team.id}/drive/root/children`).get()
            )
            const teamResponses = await Promise.allSettled(teamPromises)

            const teamActivitiesMap: Record<string, any> = {}

            for (let i = 0; i < teams.value.length; i++) {
                const team = teams.value[i]
                const driveItemsResult = teamResponses[i]

                let modifyCount = 0
                let createCount = 0
                let deleteCount = 0

                if (driveItemsResult.status === 'fulfilled') {
                    const driveItems = driveItemsResult.value
                    //console.log(driveItems)
                    for (const item of driveItems.value) {
                        if (item.lastModifiedDateTime) {
                            modifyCount++
                        }
                        if (item.createdDateTime) {
                            createCount++
                        }
                        if (item.deleted) {
                            deleteCount++
                        }
                    }
                }

                teamActivitiesMap[team.displayName] = {
                    activity: activityType,
                    count: modifyCount + createCount + deleteCount,
                    modifyCount,
                    createCount,
                    deleteCount,
                }
            }

            const sortedTeams = Object.keys(teamActivitiesMap).sort(
                (a, b) => teamActivitiesMap[b].count - teamActivitiesMap[a].count
            )

            // Print top teams
            const numTeamsToShow = 10 // Change as needed
            // console.log(`Top ${numTeamsToShow} Teams with Most ${activityType} Activities:`);
            // for (let i = 0; i < numTeamsToShow; i++) {
            //     console.log(`${i + 1}. ${sortedTeams[i]} (${teamActivitiesMap[sortedTeams[i]].count} ${activityType} activities)`);
            // }
            //console.log('teamActivitiesMap Inside', teamActivitiesMap)
            return teamActivitiesMap
        } catch (error: any) {
            console.error('Error fetching file activities:', error.message)
            return error.message
        }
    }

    // Call the function with activity type (e.g., 'file modifications')

    public static async getActivity(period: 30 | 90): Promise<Array<TeamActivity & Team>> {
        const { value: teams }: { value: Team[] } = await graphClient.api('/teams').get()

        let { value: teamsActivity } = await this.httpGet(graphLinks.teamsActivity(period))

        teamsActivity = teamsActivity.filter(activity => teams.some(team => team.id === activity.teamId))
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
