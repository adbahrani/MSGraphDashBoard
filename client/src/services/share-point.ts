import { List, Site, ItemActivityStat } from '@microsoft/microsoft-graph-types-beta'
import pAll from 'p-all'
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

export type SiteActivityWithSites = Partial<SiteActivity & Site>

export class SharePointService extends BaseService {
    public static async getAll(): Promise<Site[]> {
        const { value } = await graphClient.api(graphAPIUrls.sites).get()
        return value
    }

    public static async getActivity(period: 30 | 90): Promise<SiteActivity[]> {
        const { value } = await graphClient.api(graphAPIUrls.sitesActivity(period)).get()
        return value
    }

    public static async getSiteWithActivity(period: 30 | 90): Promise<{
        siteWithActivity: SiteActivityWithSites[]
        siteActivities: SiteActivity[]
    }> {
        const sites = await this.getAll()
        console.log('sites', sites)
        const siteActivities = await this.getActivity(period)
        console.log('siteActivities', siteActivities)

        const siteWithActivity = sites.map(site => {
            if (!site.id) return site
            const [, siteActivityId] = site.id.split(',')
            const siteActivity = siteActivities.find(siteActivity => siteActivity.siteId === siteActivityId) || null
            return {
                ...site,
                ...siteActivity,
            }
        })

        return {
            siteWithActivity,
            siteActivities,
        }
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

    public static async getAllAnalytics(
        siteIds: Array<string>
    ): Promise<{ [key: string]: ItemActivityStat & { hasError: boolean } }> {
        const actions = siteIds.map(siteId => async () => {
            try {
                const response = await this.getSiteAnalytics(siteId)
                return {
                    ...response,
                    hasError: false,
                }
            } catch (e) {
                return { hasError: true }
            }
        })
        const resp = await pAll(actions, { concurrency: 10 })
        return siteIds.reduce((acc, siteId, index) => {
            return {
                ...acc,
                [siteId]: resp[index],
            }
        }, {})
    }
}

// activityUtils.ts

interface SiteDetails {
    geolocation: string
    lastActivityDate?: string
    rootWebTemplate: string
    secureLinkForGuestCount: number
}

interface ActivityResult {
    activeSites: number
    guestEnabled: number
    groupConnected: number
    communicationSites: number
    activityByGeo: { geolocation: string; active: number; inactive: number }[]
}

export function calculateActivityData(
    siteWithActivity: Array<SiteActivityWithSites>,
    selectedPeriod: number
): ActivityResult {
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
