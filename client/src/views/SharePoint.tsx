import { useEffect, useMemo, useState } from 'react'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import { Site, ItemActivityStat } from '@microsoft/microsoft-graph-types'
import { AgChartsReact } from 'ag-charts-react'
import { SharePointService, SiteActivity, SiteActivityWithSites } from '../services/share-point'
import { Stats } from '../components/shared/Stats'
import { BoxLoader } from '../components/shared/Loaders/BoxLoader'
import { SharePointSitesList } from '../components/SharePointSitesList'
import { columnDefSelectedSitePages, columnDefSiteAudience, columnDefTopSites } from '../columnsDef/sharePoint'
import { SitesList } from '../components/SitesList'
import { Block } from '../components/shared/Block'

const activityByGeoLocationOptions = {
    theme: {
        overrides: {
            column: {
                axes: {
                    category: {
                        groupPaddingInner: 0,
                    },
                },
            },
        },
    },
    title: {
        text: 'Active/Inactive site by geolocation',
    },
    series: [
        {
            type: 'column' as const,
            xKey: 'geolocation',
            yKey: 'active',
            yName: 'Active',
        },
        {
            type: 'column' as const,
            xKey: 'geolocation',
            yKey: 'inactive',
            yName: 'Inactive',
        },
    ],
}


export const SharePoint = () => {
    const [isLoadingSiteActivities, setIsLoadingSiteActivities] = useState(true)
    const [sites, setSites] = useState<Array<Site>>([])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedSitePages, setSelectedSitePages] = useState<{[key: string]: ItemActivityStat & {hasError: boolean}}>({})
    const [selectedSite, setSelectedSite] = useState<any | null>(null)
    const [sitesActivity, setSitesActivity] = useState<Array<SiteActivity>>([])
    const [sitesWithActivity, setSitesWithActivity] = useState<Array<SiteActivityWithSites>>([])
    const [sitesCount, setSitesCount] = useState({
        guestEnabled: 0,
        groupConnected: 0,
        communicationSites: 0,
        activeSites: 0,
    })

    const periods = [
        { label: 'Last 30 days', value: 30 },
        { label: 'Last 90 days', value: 90 },
    ] as const

    const [selectedPeriod, setSelectedPeriod] = useState<30 | 90>(30)

    const [activityByGeoLocation, setActivityByGeoLocation] = useState<
        Array<{ geolocation: string; active: number; inactive: number }>
    >([])


    const topSitesByPageView = useMemo(() => {
        const sortedData = sitesWithActivity.filter((dt: SiteActivityWithSites) => dt.pageViewCount !== undefined) as SiteActivity[]
        sortedData.sort((a1, a2) => a2.pageViewCount - a1.pageViewCount)

        return sortedData.slice(0, 5)
    }, [sitesWithActivity])
    const topSitesByPageViewOptions = {
        title: {
            text: 'Top 5 sites / views',
        },
        series: [
            {
                type: 'column' as const,
                xKey: 'ownerDisplayName',
                yKey: 'pageViewCount',
                yName: 'Page Views',
                stacked: true,
            },
        ],
    }

    useEffect(() => {
        // TODO: fix denied access to sites/getAllSites
        SharePointService.getAll().then(() => setSites([]))
    }, [])

    useEffect(() => {
        (async function () {
            // Considered data for all sites, if only top 5 sites needed we can use topSitesByPageView instead
            const siteAnalyticsData = await SharePointService.getAllAnalytics(sitesWithActivity.map((site) => site.siteId!))
            //const siteAnalyticsData = await SharePointService.getAllAnalytics(.map((site) => site.siteId))
            setSelectedSitePages(siteAnalyticsData)
        })()
    }, [sitesWithActivity])

    async function setActivityData() {
        const {
            siteWithActivity,
            siteActivities
        } = await SharePointService.getSiteWithActivity(selectedPeriod)
        setSitesActivity([...siteActivities])
        setSitesWithActivity([...siteWithActivity])
        setIsLoadingSiteActivities(false)

        const minDate = new Date()
        minDate.setDate(minDate.getDate() - selectedPeriod)

        let activeSites = 0
        let groupConnected = 0
        let guestEnabled = 0
        let communicationSites = 0
        const activityByGeo: any[] = []
        const geoLocIndex: { [geolocation: string]: number } = {}
        for (const { geolocation, lastActivityDate, rootWebTemplate, secureLinkForGuestCount } of siteWithActivity) {
            if (!geolocation) continue
            if (geoLocIndex[geolocation] === undefined) {
                geoLocIndex[geolocation] = activityByGeo.length
                activityByGeo.push({ geolocation, active: 0, inactive: 0 })
            }
            if (lastActivityDate && new Date(lastActivityDate) >= minDate) {
                activeSites++
                activityByGeo[geoLocIndex[geolocation]].active++
            } else {
                activityByGeo[geoLocIndex[geolocation]].inactive++
            }

            if (rootWebTemplate === 'Group') {
                groupConnected++
            }

            if (rootWebTemplate === 'Communication Site') {
                communicationSites++
            }

            if (secureLinkForGuestCount) {
                guestEnabled++
            }
        }

        setSitesCount({
            activeSites,
            guestEnabled,
            groupConnected,
            communicationSites,
        })
        setActivityByGeoLocation(activityByGeo)
    }

    useEffect(() => {
        setActivityData()
    }, [selectedPeriod])

    const activeSitesCount = sitesCount.activeSites

    return (
        <>

            <Stack direction="row" alignItems="center" justifyContent="center" sx={{
                margin: 2
            }}>
                {periods.map(period => (
                    <Chip
                        key={period.value}
                        sx={{ m: 1 }}
                        label={period.label}
                        variant={selectedPeriod === period.value ? 'filled' : 'outlined'}
                        onClick={() => {
                            setIsLoadingSiteActivities(true)
                            setSelectedPeriod(period.value)
                        }}
                    />
                ))}
            </Stack>

            

            <Stack alignItems="center">
                {isLoadingSiteActivities ? (
                    <Stack direction="row" gap="0.5rem" sx={{ width: '100%' }}>
                        <BoxLoader numberOfBoxes={8} boxHeight="8rem" boxWidth="18%" />
                    </Stack>
                ) : (
                    <Stats
                        numberOfColumns={4}
                        stats={{
                            'Sites Count': sitesWithActivity.length,
                            'Active sites': activeSitesCount,
                            'Inactive sites': `${sitesWithActivity.length - activeSitesCount} (
                        ${100 - Math.round((100 * activeSitesCount) / sitesWithActivity.length)} %)`,
                            'Active vs Total Sites': `${Math.round((100 * activeSitesCount) / sitesWithActivity.length)} %`,
                            'Guest Enabled Sites Count': sitesCount.guestEnabled,
                            'Group-Connected Sites Count': sitesCount.groupConnected,
                            'Communications Sites Count': sitesCount.communicationSites,
                        }}
                    />
                )}
            </Stack>
            <Stack direction="row" alignItems="start" spacing={1}>
            <Block title="Top Sites By Views">
                <SharePointSitesList
                    handleRowClick={site => {
                        setSelectedSite(site)
                        setIsDrawerOpen(true)
                    }}
                    height="35rem"
                    isLoading={isLoadingSiteActivities}
                    width="100%"
                    columnDefs={columnDefTopSites}
                    sites={topSitesByPageView}
                />
                </Block>
                <Stack>
                    <div>
                        <AgChartsReact
                            options={{ ...activityByGeoLocationOptions, width: 380, data: activityByGeoLocation }}
                        />
                    </div>
                    <div>
                        <AgChartsReact options={{ ...topSitesByPageViewOptions, width: 380, data: topSitesByPageView }} />
                    </div>
                </Stack>
            </Stack>

            <Stack direction="row">
            <Block title="Site Audience by: Department, Country, City">
                <SharePointSitesList
                    handleRowClick={site => {
                        setSelectedSite(site)
                        setIsDrawerOpen(true)
                    }}
                    height="25rem"
                    isLoading={isLoadingSiteActivities}
                    width="100%"
                    columnDefs={columnDefSiteAudience}
                    sites={[]}
                />
                </Block>
                <Block title="Selected Site Pages/Top Page By Views">
                <SharePointSitesList
                    handleRowClick={site => {
                        setSelectedSite(site)
                        setIsDrawerOpen(true)
                    }}
                    height="25rem"
                    isLoading={isLoadingSiteActivities}
                    width="100%"
                    columnDefs={columnDefSelectedSitePages}
                    sites={sitesWithActivity.filter((site) => site.siteId && !selectedSitePages[site.siteId]?.hasError).map((site) => {
                        return {
                            ...site,
                            ...selectedSitePages[site.siteId!]
                        }
                    })}
                />
                </Block>
            </Stack>

            <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <div style={{ width: '50vw', height: '100vh' }}>{
                    <SitesList sites={selectedSite ? sitesActivity.filter((siteActivity) => {
                        return siteActivity.siteId === (selectedSite as SiteActivity).siteId
                    }) : []} />
                }</div>
            </Drawer>
        </>
    )
}
