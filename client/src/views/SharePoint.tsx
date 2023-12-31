import { useEffect, useMemo, useState } from 'react'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import { Site, ItemActivityStat } from '@microsoft/microsoft-graph-types-beta'
import { AgChartsReact } from 'ag-charts-react'
import { SharePointService, SiteActivity, SiteActivityWithSites, calculateActivityData } from '../services/share-point'
import { Stats } from '../components/shared/Stats'
import { BoxLoader } from '../components/shared/Loaders/BoxLoader'
import { SharePointSitesList } from '../components/SharePointSitesList'
import { columnDefSelectedSitePages, columnDefSiteAudience, columnDefTopSites } from '../columnsDef/sharePoint'
import { SitesList } from '../components/SitesList'
import { periods } from '../constants'

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
    const [selectedSitePages, setSelectedSitePages] = useState<{
        [key: string]: ItemActivityStat & { hasError: boolean }
    }>({})
    const [selectedSite, setSelectedSite] = useState<any | null>(null)
    const [sitesActivity, setSitesActivity] = useState<Array<SiteActivity>>([])
    const [sitesWithActivity, setSitesWithActivity] = useState<Array<SiteActivityWithSites>>([])
    const [sitesCount, setSitesCount] = useState({
        guestEnabled: 0,
        groupConnected: 0,
        communicationSites: 0,
        activeSites: 0,
    })

    const [selectedPeriod, setSelectedPeriod] = useState<30 | 90>(30)

    const [activityByGeoLocation, setActivityByGeoLocation] = useState<
        Array<{ geolocation: string; active: number; inactive: number }>
    >([])

    const topSitesByPageView = useMemo(() => {
        return sitesWithActivity.filter(
            (dt: SiteActivityWithSites) => dt.pageViewCount !== undefined && dt.pageViewCount > 0
        ) // as SiteActivity[]
    }, [sitesWithActivity])
    const topSitesByPageViewOptions = {
        title: {
            text: 'Top sites / views',
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
        SharePointService.getAll().then(sites => setSites(sites))
    }, [])

    useMemo(() => {
        const siteAnalyticsData = async () => {
            const res = await SharePointService.getAllAnalytics(sitesWithActivity.map(site => site.siteId!))
            console.log('siteAnalyticsData', res)
            setSelectedSitePages(res)
        }
        siteAnalyticsData()
    }, [sitesWithActivity])

    async function setActivityData() {
        const { siteWithActivity, siteActivities } = await SharePointService.getSiteWithActivity(selectedPeriod)
        setSitesActivity([...siteActivities])
        setSitesWithActivity([...siteWithActivity])
        setIsLoadingSiteActivities(false)

        const { activeSites, guestEnabled, groupConnected, communicationSites, activityByGeo } = calculateActivityData(
            siteWithActivity,
            selectedPeriod
        )

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
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ margin: 2 }}>
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
                            'Active vs Total Sites': `${Math.round(
                                (100 * activeSitesCount) / sitesWithActivity.length
                            )} %`,
                            'Guest Enabled Sites Count': sitesCount.guestEnabled,
                            'Group-Connected Sites Count': sitesCount.groupConnected,
                            'Communications Sites Count': sitesCount.communicationSites,
                        }}
                    />
                )}
            </Stack>
            <Stack direction="row" alignItems="start" spacing={1}>
                <SharePointSitesList
                    title="Top Sites By Views"
                    handleRowClick={site => {
                        setSelectedSite(site)
                        setIsDrawerOpen(true)
                    }}
                    height="31rem"
                    isLoading={isLoadingSiteActivities}
                    width="100%"
                    columnDefs={columnDefTopSites}
                    sites={topSitesByPageView}
                />

                <Stack>
                    <div>
                        <AgChartsReact
                            options={{ ...activityByGeoLocationOptions, width: 380, data: activityByGeoLocation }}
                        />
                    </div>
                    <div>
                        <AgChartsReact
                            options={{ ...topSitesByPageViewOptions, width: 380, data: topSitesByPageView }}
                        />
                    </div>
                </Stack>
            </Stack>

            <Stack direction="row">
                <SharePointSitesList
                    title="Site Audience by: Department, Country, City"
                    handleRowClick={site => {
                        setSelectedSite(site)
                        setIsDrawerOpen(true)
                    }}
                    height="25rem"
                    isLoading={isLoadingSiteActivities}
                    width="90%"
                    columnDefs={columnDefSiteAudience}
                    sites={[]}
                />

                <SharePointSitesList
                    title="Selected Site Pages/Top Page By Views"
                    handleRowClick={site => {
                        setSelectedSite(site)
                        setIsDrawerOpen(true)
                    }}
                    height="25rem"
                    isLoading={isLoadingSiteActivities}
                    width="90%"
                    columnDefs={columnDefSelectedSitePages}
                    sites={sitesWithActivity
                        .filter(site => site.siteId && !selectedSitePages[site.siteId]?.hasError)
                        .map(site => {
                            return {
                                ...site,
                                ...selectedSitePages[site.siteId!],
                            }
                        })}
                />
            </Stack>

            <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <div style={{ width: '50vw', height: '100vh' }}>
                    {
                        <SitesList
                            sites={
                                selectedSite
                                    ? sitesActivity.filter(siteActivity => {
                                          return siteActivity.siteId === (selectedSite as SiteActivity).siteId
                                      })
                                    : []
                            }
                        />
                    }
                </div>
            </Drawer>
        </>
    )
}
