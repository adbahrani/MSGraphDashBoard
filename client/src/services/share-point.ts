import { graphLinks } from '../graphHelper'
import { BaseService } from './base'

export interface Site {
    id: string
    name: string
    siteCollection: {
        hostname: string
        dataLocationCode: string
    }
    webUrl: string
}

export interface SiteActivity {
    reportRefreshDate: string
    siteId: string
    siteUrl: string
    ownerDisplayName: string
    ownerPrincipalName: string
    isDeleted: boolean
    lastActivityDate: string | null
    siteSensitivityLabelId: string
    externalSharing: boolean
    unmanagedDevicePolicy: string
    geolocation: string
    fileCount: number
    activeFileCount: number
    pageViewCount: number
    visitedPageCount: number
    storageUsedInBytes: number
    storageAllocatedInBytes: number
    anonymousLinkCount: number
    companyLinkCount: number
    secureLinkForGuestCount: number
    secureLinkForMemberCount: number
    rootWebTemplate: string
    reportPeriod: string
}

export class SharePointService extends BaseService {
    public static async getAll(): Promise<Array<Site>> {
        const { value } = await this.httpGet(graphLinks.sites)

        return value
    }

    public static async getActivity(period: 30 | 90): Promise<Array<SiteActivity>> {
        const { value } = await this.httpGet(graphLinks.sitesActivity(period))

        return value
    }

    public static async getFileCount(period: 30 | 90): Promise<Array<SiteActivity>> {
        const { value } = await this.httpGet(graphLinks.fileCount(period))

        return value
    }

    public static async getSiteAnalytics(siteId: string): Promise<Array<SiteActivity>> {
        const { value } = await this.httpGet(graphLinks.siteAnalytics(siteId))

        return value
    }

    
}
