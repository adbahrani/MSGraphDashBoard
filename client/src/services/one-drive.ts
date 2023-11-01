import { graphLinks } from '../graphHelper'
import { BaseService } from './base'

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

export class DriveOneService extends BaseService {
    public static async getActivity(period: 30 | 90): Promise<Array<OneDriveActivity>> {
        const { value } = await this.httpGet(graphLinks.driveOneActivity(period))

        return value
    }

    public static async getUserActivity(period: 30 | 90): Promise<Array<OneDriveUserActivity>> {
        const { value } = await this.httpGet(graphLinks.driveOneUserActivity(period))

        return value
    }
}
