import { List, Site, ItemActivityStat, SiteCollection, ItemActionStat } from '@microsoft/microsoft-graph-types-beta'
import { graphAPIUrls } from '../graphHelper'
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
export type SharePointSite = {
    createdDateTime: string
    displayName: string
    id: string
    isPersonalSite: boolean
    name: string
    root: object // You might want to replace this with a more specific type
    siteCollection: SiteCollection
    webUrl: string
}

export interface SiteAnalytics extends SharePointSite {
    access: ItemActionStat
}
export interface SiteActivityExtended extends SiteActivity, SharePointSite {}

export type SitesActivity = {
    [key: string]: ItemActivityStat
}
export class SharePointService extends BaseService {
    public static async getAll(): Promise<SharePointSite[]> {
        const { value } = await graphClient.api('sites').get()
        return this.stripExtraSitesId(value)
    }

    public static async getSitesActivity(period: 30 | 90): Promise<SiteActivity[]> {
        const { value: sites }: { value: SiteActivity[] } = await graphClient
            .api(graphAPIUrls.sharePointSiteUsageDetail(period))
            .get()
        return sites
    }

    private static stripExtraSitesId(sites): SharePointSite[] {
        return sites.map(site => {
            const [, siteActivityId] = site.id.split(',')
            return { ...site, id: siteActivityId }
        })
    }

    public static getFullSitesDetails(sites, sitesActivities): SiteActivityExtended[] {
        const siteActivityExtended = sites.map(site => {
            const siteActivity = sitesActivities.find(siteActivity => siteActivity.siteId === site.id) || null
            return {
                ...site,
                ...siteActivity,
            } as SiteActivityExtended
        })

        return siteActivityExtended
    }

    public static async getFileCount(period: 30 | 90): Promise<SiteActivity[]> {
        const { value } = await graphClient.api(graphAPIUrls.fileCount(period)).get()
        return value
    }

    public static async getSiteAnalytics(siteId: string): Promise<ItemActivityStat> {
        return graphClient.api(graphAPIUrls.siteAnalytics(siteId)).get()
    }

    public static async getSiteList(siteId: string): Promise<Array<List>> {
        const { value } = await graphClient.api(graphAPIUrls.siteList(siteId)).get()
        return value
    }

    public static async getAllAnalytics(sites: SharePointSite[]): Promise<SiteAnalytics[]> {
        console.log('Analytics Call')
        const getSiteAnalyticsPromises = sites.map(async site => {
            const analytics = await this.getSiteAnalytics(site.id)
            return {
                ...site,
                access: analytics.access,
            }
        })

        const analyticsResults = await Promise.allSettled(getSiteAnalyticsPromises)
        const siteAnalytics: SiteAnalytics[] = analyticsResults
            .map(result => result.status === 'fulfilled' && result.value)
            .filter(Boolean) as SiteAnalytics[]

        return siteAnalytics.filter(site => site.access.actionCount && site.access.actionCount > 0)
    }
}

// activityUtils.ts

interface ActivityResult {
    activeSites: number
    guestEnabled: number
    groupConnected: number
    communicationSites: number
    activityByGeo: { geolocation: string; active: number; inactive: number }[]
}

export function calculateActivityData(siteWithActivity: Array<SiteActivity>, selectedPeriod: number): ActivityResult {
    const minDate = new Date()
    minDate.setDate(minDate.getDate() - selectedPeriod)

    let activeSites = 0
    let groupConnected = 0
    let guestEnabled = 0
    let communicationSites = 0
    const activityByGeo: { geolocation: string; active: number; inactive: number }[] = []
    const geoLocIndex: { [geolocation: string]: number } = {}

    for (const { geolocation, lastActivityDate, rootWebTemplate, secureLinkForGuestCount } of siteWithActivity) {
        if (!geolocation) continue

        if (geoLocIndex[geolocation] === undefined) {
            geoLocIndex[geolocation] = activityByGeo.length
            activityByGeo.push({ geolocation, active: 0, inactive: 0 })
        }

        const index = geoLocIndex[geolocation]
        const isActive = lastActivityDate && new Date(lastActivityDate) >= minDate

        if (isActive) {
            activeSites++
            activityByGeo[index].active++
        } else {
            activityByGeo[index].inactive++
        }

        if (rootWebTemplate === 'Group') groupConnected++
        if (rootWebTemplate === 'Communication Site') communicationSites++
        if (secureLinkForGuestCount) guestEnabled++
    }

    return {
        activeSites,
        guestEnabled,
        groupConnected,
        communicationSites,
        activityByGeo,
    }
}
