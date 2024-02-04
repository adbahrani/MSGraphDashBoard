import { useCallback, useEffect, useMemo, useState } from 'react'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'

import { AgChartsReact } from 'ag-charts-react'
import {
    SharePointService,
    SiteActivity,
    SiteActivityExtended,
    calculateActivityData,
    SharePointSite,
    SiteAnalytics,
} from '../services/share-point'
import { Stats } from '../components/shared/Stats'
import { BoxLoader } from '../components/shared/Loaders/BoxLoader'
import { SharePointSitesList } from '../components/SharePointSitesList'
import { columnDefSelectedSitePages, columnDefSiteAudience, columnDefTopSites } from '../columnsDef/sharePoint'
import { SitesList } from '../components/SitesList'
import { periods } from '../constants'
import { Block } from '../components/shared/Block'
import { Box, Container } from '@mui/material'

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
export const SharePoint = () => {
    const [isLoadingSiteActivities, setIsLoadingSiteActivities] = useState(true)
    const [sites, setSites] = useState<SharePointSite[]>()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedSitePages, setSelectedSitePages] = useState<SiteAnalytics[]>([])
    const [selectedSite, setSelectedSite] = useState<any | null>(null)
    const [sitesActivity, setSitesActivity] = useState<Array<SiteActivity>>([])
    const [sitesActivityExtended, setSitesActivityExtended] = useState<SiteActivityExtended[]>([])
    const [sitesCount, setSitesCount] = useState({
        guestEnabled: 0,
        groupConnected: 0,
        communicationSites: 0,
        activeSites: 0,
        totalActionCount: 0,
        totalActorCount: 0,
    })

    const [selectedPeriod, setSelectedPeriod] = useState<30 | 90>(30)

    const [activityByGeoLocation, setActivityByGeoLocation] = useState<
        Array<{ geolocation: string; active: number; inactive: number }>
    >([])

    const Activities = useCallback(async selectedPeriod => {
        const _sitesActivity = await SharePointService.getSitesActivity(selectedPeriod)
        setSitesActivity(_sitesActivity)
    }, [])

    useEffect(() => {
        SharePointService.getAll().then(res => setSites(res))
    }, [])

    useEffect(() => {
        Activities(selectedPeriod)
    }, [selectedPeriod])

    useEffect(() => {
        TopSitesByWithUniqueView()
    }, [sites])

    useEffect(() => {
        if (!sitesActivity.length || !sites?.length) return
        const res: SiteActivityExtended[] = SharePointService.getFullSitesDetails(sites, sitesActivity)
        console.log('res', res)
        setSitesActivityExtended(res)

        setIsLoadingSiteActivities(false)
    }, [sitesActivity, sites])

    useEffect(() => {
        const { activeSites, guestEnabled, groupConnected, communicationSites, activityByGeo } = calculateActivityData(
            sitesActivityExtended,
            selectedPeriod
        )

        setSitesCount(p => ({ ...p, activeSites, guestEnabled, groupConnected, communicationSites }))
        setActivityByGeoLocation(activityByGeo)
    }, [sitesActivityExtended])

    const activeSitesCount = sitesCount.activeSites

    const TopSitesByView = JSON.parse(
        JSON.stringify(sitesActivityExtended.filter(site => site.pageViewCount > 0))
    ).sort((a, b) => b.pageViewCount - a.pageViewCount)

    const TopSitesByWithUniqueView = async () => {
        if (!sites) return
        const analytics = await SharePointService.getAllAnalytics(sites)
        setSelectedSitePages(analytics)
        let totalActionCount = 0,
            totalActorCount = 0
        analytics.forEach(site => {
            if (site.access) {
                totalActionCount += site.access.actionCount || 0
                totalActorCount += site.access.actorCount || 0
            }
        })

        setSitesCount(p => ({ ...p, totalActionCount, totalActorCount }))
    }

    const getResponsiveValue = (intial, responsive) => (window.innerWidth >= 900 ? intial : responsive)

    return (
        <Container maxWidth="xl">
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
                        <BoxLoader numberOfBoxes={10} boxHeight="8rem" boxWidth="18%" />
                    </Stack>
                ) : (
                    <Stats
                        numberOfColumns={5}
                        stats={{
                            'Sites Count': sitesActivityExtended.length,
                            'Active sites': activeSitesCount,
                            'Inactive sites': `${sitesActivityExtended.length - activeSitesCount} (${
                                100 - Math.round((100 * activeSitesCount) / sitesActivityExtended.length)
                            }%)`,
                            'Active vs Total Sites': `${Math.round(
                                (100 * activeSitesCount) / sitesActivityExtended.length
                            )} %`,
                            'Guest Enabled Sites Count': sitesCount.guestEnabled,
                            'Group-Connected Sites Count': sitesCount.groupConnected,
                            'Communications Sites Count': sitesCount.communicationSites,
                            'Changed in View %': '0% - No Data',
                            'Total Viewer': sitesCount.totalActorCount,
                            'Total Pages Views': sitesCount.totalActionCount,
                        }}
                    />
                )}
            </Stack>
            <Stack
                direction={getResponsiveValue('row', 'column')}
                alignItems="start"
                sx={{ width: '100%' }}
                spacing={1}
            >
                <Box sx={{ width: '100%' }}>
                    <SharePointSitesList
                        title="Top Sites By Views"
                        handleRowClick={site => {
                            setSelectedSite(site)
                            setIsDrawerOpen(true)
                        }}
                        height={getResponsiveValue('38rem', '15rem')}
                        isLoading={isLoadingSiteActivities}
                        width="100%"
                        columnDefs={columnDefTopSites}
                        sites={TopSitesByView}
                    />
                </Box>

                <Stack direction={getResponsiveValue('column', 'row')}>
                    <Block>
                        <AgChartsReact
                            options={{
                                ...activityByGeoLocationOptions,
                                width: getResponsiveValue(380, window.innerWidth / 2 - 35),
                                data: activityByGeoLocation,
                            }}
                        />
                    </Block>
                    <Block>
                        <AgChartsReact
                            options={{
                                ...topSitesByPageViewOptions,
                                width: getResponsiveValue(380, window.innerWidth / 2 - 35),
                                data: TopSitesByView.slice(0, 5),
                            }}
                        />
                    </Block>
                </Stack>
            </Stack>

            <Stack direction={getResponsiveValue('row', 'column')}>
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
                    title="Site/Top Views by Pages all times"
                    handleRowClick={site => {
                        setSelectedSite(site)
                        setIsDrawerOpen(true)
                    }}
                    height="25rem"
                    isLoading={isLoadingSiteActivities}
                    width="90%"
                    columnDefs={columnDefSelectedSitePages}
                    sites={selectedSitePages}
                />
            </Stack>

            <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <Box sx={{ width: '50vw', height: '100vh' }}>
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
                </Box>
            </Drawer>
        </Container>
    )
}
