import { Site } from '@microsoft/microsoft-graph-types'
import { graphLinks } from '../graphHelper'
import { BaseService, graphClient } from './base' 

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

export type SiteActivityWithSites = Partial<SiteActivity & Site>

export class SharePointService extends BaseService {
    public static async getAll(): Promise<Array<Site>> {
        const { value } = await graphClient.api('sites/getAllSites').get()
        return value
    }

    public static async getActivity(period: 30 | 90): Promise<Array<SiteActivity>> {
        const { value } = await graphClient.api(`/reports/microsoft.graph.getSharePointSiteUsageDetail(period='D${period}')?$format=application/json`).get()
        return value
    }

    public static async getSiteWithActivity(period: 30 | 90): Promise<{
        siteWithActivity: Array<SiteActivityWithSites>
        siteActivities: Array<SiteActivity>
    }> {
        const sites = await this.getAll()
        const siteActivities = await this.getActivity(period)

        const siteWithActivity = sites.map(site => {
            if(!site.id) return site
            const [, siteActivityId] = site.id.split(',')
            const siteActivity = siteActivities.find(siteActivity => siteActivity.siteId === siteActivityId) || null
            return {
                ...site,
                ...siteActivity,
            }
        })

        return {
            siteWithActivity: siteWithActivity,
            siteActivities
        }
    }

    public static async getFileCount(period: 30 | 90): Promise<Array<SiteActivity>> {
        const { value } = await this.httpGet(graphLinks.fileCount(period))
        return value
    }

    public static async getSiteAnalytics(siteId: string): Promise<Array<SiteActivity>> {
        const { value } = await graphClient.api(`sites/${siteId}/analytics/allTime`).get()
        return value
    }

    public static async getSiteList(siteId: string): Promise<Array<Site>> {
        const { value } = await graphClient.api(`sites/${siteId}/lists`).get()
        return value
    }
}
