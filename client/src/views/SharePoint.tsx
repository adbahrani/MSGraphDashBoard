import { useEffect, useMemo, useState } from 'react'
import Chip from '@mui/material/Chip'
import { AgChartsReact } from 'ag-charts-react'
import { SharePointService, Site, SiteActivity, SiteActivityWithSites } from '../services/share-point'
import { Stats } from '../components/shared/Stats'
import { BoxLoader } from '../components/shared/Loaders/BoxLoader'
import { ColDef } from 'ag-grid-community'
import { formatBytes } from '../utils/helpers'
import { SharePointSitesList } from '../components/SharePointSitesList'
import { columnDefTopSites } from '../columnsDef/sharePoint'
import { Box, Button, Drawer, Stack } from '@mui/material'
import { SitesList } from '../components/SitesList'

export const SharePoint = () => {
    const [isLoadingSiteActivities, setIsLoadingSiteActivities] = useState(true)
    const [sites, setSites] = useState<Array<Site>>([])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedSite, setSelectedSite] = useState<any | null>(null)
    const [sitesActivity, setSitesActivity] = useState<Array<SiteActivityWithSites>>([])
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
    //const boxStyle = { display: 'flex', flex: 1, justifyContent: 'center', fontSize: 16, fontWeight: 'bold' }

    const [activityByGeoLocation, setActivityByGeoLocation] = useState<
        Array<{ geolocation: string; active: number; inactive: number }>
    >([])
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

    const topSitesByPageView = useMemo(() => {
        const sortedData  = sitesActivity.filter((dt: SiteActivityWithSites) => dt.pageViewCount !== undefined) as SiteActivity[]
        sortedData.sort((a1, a2) =>  a2.pageViewCount - a1.pageViewCount)

        return sortedData.slice(0, 5)
    }, [sitesActivity])
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
        if (!selectedSite) return
        ;(async function () {
            const siteAnalyticsData = await SharePointService.getSiteAnalytics(selectedSite.id)
            const lists = await SharePointService.getSiteList(selectedSite.id)

            // console.log('data is', siteAnalyticsData, lists);
        })()
    }, [selectedSite])

    async function setActivityData() {
        const sitesActivity = await SharePointService.getSiteWithActivity(selectedPeriod)
        setSitesActivity([...sitesActivity])
        setIsLoadingSiteActivities(false)

        const minDate = new Date()
        minDate.setDate(minDate.getDate() - selectedPeriod)

        let activeSites = 0
        let groupConnected = 0
        let guestEnabled = 0
        let communicationSites = 0
        const activityByGeo: any[] = []
        const geoLocIndex: { [geolocation: string]: number } = {}
        for (const { geolocation, lastActivityDate, rootWebTemplate, secureLinkForGuestCount } of sitesActivity) {
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
            <div style={{ display: 'flex', justifyContent: 'center', margin: 5 }}>
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
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {isLoadingSiteActivities ? (
                    <div style={{ width: '100%', display: 'flex', gap: '0.5rem' }}>
                        <BoxLoader numberOfBoxes={8} boxHeight="8rem" boxWidth="18%" />
                    </div>
                ) : (
                    <Stats
                        numberOfColumns={4}
                        stats={{
                            'Sites Count': sitesActivity.length,
                            'Active sites': activeSitesCount,
                            'Inactive sites': `${sitesActivity.length - activeSitesCount} (
                        ${100 - Math.round((100 * activeSitesCount) / sitesActivity.length)} %)`,
                            'Active vs Total Sites': `${Math.round((100 * activeSitesCount) / sitesActivity.length)} %`,
                            'Guest Enabled Sites Count': sitesCount.guestEnabled,
                            'Group-Connected Sites Count': sitesCount.groupConnected,
                            'Communications Sites Count': sitesCount.communicationSites,
                        }}
                    />
                )}
            </div>
            <Stack direction="row" alignItems="center" spacing={1}>
            <SharePointSitesList
                handleRowClick={site => {
                    setSelectedSite(site)
                }}
                height="14rem"
                isLoading={isLoadingSiteActivities}
                width="80%"
                columnDefs={columnDefTopSites}
                sites={topSitesByPageView}
            />
            <Button variant="contained" color="info" size='medium'>
                Click For Site Stats
            </Button>
            </Stack>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div>
                    <AgChartsReact
                        options={{ ...activityByGeoLocationOptions, width: 400, data: activityByGeoLocation }}
                    />
                </div>
                <div>
                    <AgChartsReact options={{ ...topSitesByPageViewOptions, width: 400, data: topSitesByPageView }} />
                </div>
            </div>
            <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <div style={{ width: '50vw', height: '100vh' }}>{/* <SitesList sites={sitesActivity} /> */}</div>
            </Drawer>
        </>
    )
}
