import { graphLinks } from '../graphHelper'
import { BaseService, makeGraphAPICall } from './base'
import { Drive, Team } from '@microsoft/microsoft-graph-types-beta'

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
            const teams = await makeGraphAPICall('/teams')
            for (const team of teams.value) {
                const driveItems = await makeGraphAPICall(`/groups/${team.id}/drive/root/children`)
                console.log(`Team: ${team.displayName}, File Count: ${driveItems.value.length}`)
                console.log(driveItems)
            }
        } catch (error: any) {
            console.error('Error fetching files:', error.message)
        }
    }

    // Fetch file activities for each team
    // Fetch file activities for each team
    // Function to get activities for a specific drive
    public static async getDriveActivities(driveId: string): Promise<any> {
        try {
            const activities = await makeGraphAPICall(`/drives/${driveId}/activities`)
            return activities.value
        } catch (error: any) {
            console.error(`Error fetching activities for drive ${driveId}:`, error.message)
            return []
        }
    }

    // Function to get drive IDs for a specific team
    public static async getDriveIdsForTeam(teamId: string): Promise<string[]> {
        try {
            const { value: drives }: { value: Drive[] } = await makeGraphAPICall(`/groups/${teamId}/drives`)
            return drives.map(drive => drive.id).filter(id => id !== undefined) as string[]
        } catch (error: any) {
            console.error(`Error fetching drive IDs for team ${teamId}:`, error.message)
            return []
        }
    }

    // Function to count activities for a team
    static async countActivitiesForTeam(team: any): Promise<any> {
        const driveIds = await this.getDriveIdsForTeam(team.id)

        let modifyCount = 0
        let createCount = 0
        let deleteCount = 0

        // Iterate through all drives of the team
        for (const driveId of driveIds) {
            const activities = await this.getDriveActivities(driveId)

            // eslint-disable-next-line no-loop-func
            activities.forEach(activity => {
                if (activity.action.edit) {
                    modifyCount++
                } else if (activity.action.create) {
                    createCount++
                } else if (activity.action.delete) {
                    deleteCount++
                }
            })
        }

        return {
            teamDisplayName: team.displayName,
            teamId: team.id,
            count: modifyCount + createCount + deleteCount,
            modifyCount,
            createCount,
            deleteCount,
        }
    }

    // Main function to get activities for all teams
    public static async getFileActivitiesByTeams() {
        try {
            const { value: teams }: { value: Team[] } = await makeGraphAPICall('/teams')

            const teamPromises = teams.map(async team => this.countActivitiesForTeam(team))

            const teamDriveActivities = await Promise.allSettled(teamPromises)

            // Flatten the array
            const allDriveActivities = teamDriveActivities.flatMap(result =>
                result.status === 'fulfilled' ? result.value : []
            )

            return allDriveActivities
        } catch (error: any) {
            console.error('Error fetching file activities:', error.message)
            return error.message
        }
    }

    // Call the function with activity type (e.g., 'file modifications')

    public static async getActivity(period: 30 | 90): Promise<Array<TeamActivity & Team>> {
        const { value: teams }: { value: Team[] } = await makeGraphAPICall('/teams')

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
