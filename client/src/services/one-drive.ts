import { graphAPIUrls } from '../graphHelper'
import { makeGraphAPICall } from './base'
import { TeamsService } from './teams'

export interface OneDriveActivity {
    reportRefreshDate: string
    siteId: string
    siteUrl: string
    ownerDisplayName: string
    ownerPrincipalName: string
    isDeleted: boolean
    lastActivityDate: string | null
    fileCount: number
    activeFileCount: number
    storageUsedInBytes: number
    storageAllocatedInBytes: number
    reportPeriod: string
}

export interface OneDriveUserActivity {
    reportRefreshDate: string
    userPrincipalName: string
    isDeleted: boolean
    deletedDate: string | null
    lastActivityDate: string | null
    viewedOrEditedFileCount: number
    syncedFileCount: number
    sharedInternallyFileCount: number
    sharedExternallyFileCount: number
    assignedProducts: string[]
    reportPeriod: string
}

export type OneDriveStats = {
    syncedFiles: number
    sharedInternally: number
    sharedExternally: number
    totalUsedStorage: number | string
}

export type Influencer = {
    userName: string
    sync: number
    share: number
    viewEdit: number
}
export class DriveOneService {
    public static async getActivity(period: 30 | 90): Promise<Array<OneDriveActivity>> {
        const { value: oneDriveActivities }: { value: OneDriveActivity[] } = await makeGraphAPICall(
            graphAPIUrls.driveOneActivity(period)
        )

        const sitesPromises = oneDriveActivities.map(async (activity: OneDriveActivity) => ({
            ...activity,
            siteUrl: await this.getSiteUrl(activity.siteId),
        }))
        const res = await Promise.allSettled(sitesPromises)

        return res.map(r => r.status === 'fulfilled' && r.value) as OneDriveActivity[]
    }

    public static async getDriveActivityBySiteId(siteId: string): Promise<any> {
        const { id: driveId } = await makeGraphAPICall(`/sites/${siteId}/drive`)
        return await TeamsService.getActivityCounts(driveId)
    }

    private static async getSiteUrl(siteId: string): Promise<string> {
        const { webUrl } = await makeGraphAPICall(graphAPIUrls.siteDetails(siteId))
        return webUrl
    }

    public static async getUserActivity(period: 30 | 90): Promise<any> {
        const { value: userActivity } = await makeGraphAPICall(graphAPIUrls.driveOneUserActivity(period))
        const stats = {
            syncedFiles: 0,
            sharedInternally: 0,
            sharedExternally: 0,
        }
        const influencers: Array<Influencer> = []
        userActivity.forEach(
            ({
                userPrincipalName,
                syncedFileCount,
                sharedExternallyFileCount,
                sharedInternallyFileCount,
                viewedOrEditedFileCount,
            }) => {
                stats.syncedFiles += syncedFileCount
                stats.sharedInternally += sharedInternallyFileCount
                stats.sharedExternally += sharedExternallyFileCount
                influencers.push({
                    userName: userPrincipalName,
                    sync: syncedFileCount,
                    share: sharedExternallyFileCount + sharedInternallyFileCount,
                    viewEdit: viewedOrEditedFileCount,
                })
            }
        )

        return { stats, influencers }
    }
}
