import { graphAPIUrls } from '../graphHelper'
import { makeGraphAPICall } from './base'

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

        console.log(res.map(r => r.status === 'fulfilled' && r.value))

        return res.map(r => r.status === 'fulfilled' && r.value) as OneDriveActivity[]
    }

    private static async getSiteUrl(siteId: string): Promise<string> {
        const { webUrl } = await makeGraphAPICall(graphAPIUrls.siteDetails(siteId))
        return webUrl
    }

    public static async getUserActivity(period: 30 | 90): Promise<Array<OneDriveUserActivity>> {
        const { value } = await makeGraphAPICall(graphAPIUrls.driveOneUserActivity(period))

        return value
    }
}
