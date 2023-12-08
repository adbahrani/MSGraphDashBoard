import { useEffect, useMemo, useState } from 'react'
import Chip from '@mui/material/Chip'
import { AgChartsReact } from 'ag-charts-react'
import { SharePointService, Site, SiteActivity } from '../services/share-point'
import { Stats } from '../components/shared/Stats'
import { BoxLoader } from '../components/shared/Loaders/BoxLoader'
import { ColDef } from 'ag-grid-community'
import { formatBytes } from '../utils/helpers'
import { SharePointSitesList } from '../components/SharePointSitesList'

export const SharePoint = () => {
    const [isLoadingSiteActivities, setIsLoadingSiteActivities] = useState(true)
    const [sites, setSites] = useState<Array<Site>>([])
    const [selectedSite, setSelectedSite] = useState<SiteActivity | null>(null)
    const [sitesActivity, setSitesActivity] = useState<Array<SiteActivity>>([])
    const [sitesCount, setSitesCount] = useState({
        guestEnabled: 0,
        groupConnected: 0,
        communicationSites: 0,
        activeSites: 0
    })

    
    const periods = [
        { label: 'Last 30 days', value: 30 },
        { label: 'Last 90 days', value: 90 },
    ] as const

    const [selectedPeriod, setSelectedPeriod] = useState<30 | 90>(30)
    const boxStyle = { display: 'flex', flex: 1, justifyContent: 'center', fontSize: 16, fontWeight: 'bold' }

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

        const sortedData = [...sitesActivity]
        sortedData.sort((a1, a2) => a2.pageViewCount - a1.pageViewCount)

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
        if(!selectedSite) return;

        (async function(){
            const siteAnalyticsData = await SharePointService.getSiteAnalytics(selectedSite.siteId)
            console.log('data is', siteAnalyticsData);
        }())
    }, [selectedSite])

    async function setActivityData() {
        const sitesActivity = await SharePointService.getActivity(selectedPeriod)
        setSitesActivity([...sitesActivity])
        setIsLoadingSiteActivities(false)

        const minDate = new Date()
        minDate.setDate(minDate.getDate() - selectedPeriod)

        let activeSites = 0
        let groupConnected = 0
        let guestEnabled = 0
        let communicationSites = 0
        const activityByGeo = []
        const geoLocIndex: { [geolocation: string]: number } = {}
        for (const { geolocation, lastActivityDate, rootWebTemplate, secureLinkForGuestCount } of sitesActivity) {
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

            if (rootWebTemplate === "Group") {
                groupConnected++
            }

            if (rootWebTemplate === "Communication Site") {
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
            communicationSites
        })
        setActivityByGeoLocation(activityByGeo)
    }

    useEffect(() => {
        setActivityData()
    }, [selectedPeriod])

    const activeSitesCount = sitesCount.activeSites

    const columnDefTopSites: ColDef[] = [{ field: 'siteUrl', headerName: 'Site URL' },
    { field: 'ownerDisplayName', headerName: 'Site Name', flex: 10 }, {
        field: 'pageViewCount',
        headerName: 'Page Views Count',
        flex: 4
    },
    {
        field: 'storageUsedInBytes',
        headerName: 'Storage Used',
        valueFormatter: (params) => {
            return formatBytes(params.value)
        },
        flex: 4
    }
        , {
        field: 'fileCount',
        headerName: 'Current Files',
        flex: 4
    }, {
        field: 'secureLinkForMemberCount',
        headerName: 'Engaged Users'
    }
    ]
    return (
        <>
            <div style={{ padding: '80px 64px 0' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'end' }}>
                    {periods.map(period => (
                        <Chip
                            key={period.value}
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
                
                    {isLoadingSiteActivities ? <div style={{ width: '80%', display: 'flex', gap: '0.5rem' }}>
                        <BoxLoader numberOfBoxes={8} boxHeight='8rem' boxWidth="18%" />
                    </div> : <Stats width='80%' numberOfColumns={4} stats={{
                        "Sites Count": sitesActivity.length,
                        "Active sites": activeSitesCount,
                        "Inactive sites": `${sitesActivity.length - activeSitesCount} (
                        ${100 - Math.round((100 * activeSitesCount) / sitesActivity.length)} %)`,
                        "Active vs Total Sites": `${Math.round((100 * activeSitesCount) / sitesActivity.length)} %`,
                        "Guest Enabled Sites Count": sitesCount.guestEnabled,
                        "Group-Connected Sites Count": sitesCount.groupConnected,
                        "Communications Sites Count": sitesCount.communicationSites,
                    }} />}
                </div>
                <SharePointSitesList handleRowClick={site => {
                    setSelectedSite(site)
                }} height="14rem" isLoading={isLoadingSiteActivities} width='80%' columnDefs={columnDefTopSites} sites={topSitesByPageView} />
                
                <div style={{display: 'flex', gap: '2rem', marginLeft: '40vw'}}>
                    <AgChartsReact options={{ ...activityByGeoLocationOptions, width: 400, data: activityByGeoLocation }} />
                <AgChartsReact options={{ ...topSitesByPageViewOptions, width: 400, data: topSitesByPageView }} />
                </div>
                
            </div>
            {/* <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <div style={{ width: '50vw', height: '100vh' }}>
                    <SitesList sites={sitesActivity} />
                </div>
            </Drawer> */}
        </>
    )
}
