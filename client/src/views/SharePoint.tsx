import { useEffect, useState } from 'react'
import { Block } from '../components/shared/Block'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Chip from '@mui/material/Chip'
import { AgChartsReact } from 'ag-charts-react'
import { SharePointService, SiteActivity } from '../services/share-point'
import { SitesList } from '../components/SitesList'

export const SharePoint = () => {
    //const [sites, setSites] = useState<Array<Site>>([])
    const [sitesActivity, setSitesActivity] = useState<Array<SiteActivity>>([])
    const [activeSitesCount, setActiveSitesCount] = useState(0)

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
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

    const [topSitesByPageView, setTopSitesByPageView] = useState<Array<{ siteName: string; pageViewCount: number }>>([])
    const topSitesByPageViewOptions = {
        title: {
            text: 'Top 5 sites / views',
        },
        series: [
            {
                type: 'column' as const,
                xKey: 'siteName',
                yKey: 'pageViewCount',
                yName: 'Page Views',
                stacked: true,
            },
        ],
    }

    useEffect(() => {
        // TODO: fix denied access to sites/getAllSites
        // SharePointService.getAll().then(() => setSites([]))
    }, [])

    useEffect(() => {
        SharePointService.getActivity(selectedPeriod).then(sitesActivity => {
            setSitesActivity(sitesActivity)

            const minDate = new Date()
            minDate.setDate(minDate.getDate() - selectedPeriod)

            let activeSites = 0
            const activityByGeo: any[] = []
            const geoLocIndex: { [geolocation: string]: number } = {}
            for (const { geolocation, lastActivityDate } of sitesActivity) {
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
            }

            setActiveSitesCount(activeSites)
            setActivityByGeoLocation(activityByGeo)
            setTopSitesByPageView([
                ...sitesActivity
                    .map(({ ownerDisplayName, pageViewCount }) => ({
                        siteName: ownerDisplayName,
                        pageViewCount,
                    }))
                    .sort((a1, a2) => a2.pageViewCount - a1.pageViewCount)
                    .slice(0, 5),
            ])
        })
    }, [selectedPeriod])

    return (
        <>
            <div style={{ padding: '80px 64px 0' }}>
                <Block title="Sites count" onClick={() => setIsDrawerOpen(true)}>
                    <Box component="span" sx={boxStyle}>
                        {sitesActivity.length}
                    </Box>
                </Block>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {periods.map(period => (
                        <Chip
                            key={period.value}
                            label={period.label}
                            variant={selectedPeriod === period.value ? 'filled' : 'outlined'}
                            onClick={() => setSelectedPeriod(period.value)}
                        />
                    ))}
                </div>
                <Box component="div" sx={{ display: 'flex', gap: '8px' }}>
                    <Block title="Active sites">
                        <Box component="span" sx={boxStyle}>
                            {activeSitesCount} ({Math.round((100 * activeSitesCount) / sitesActivity.length)} %)
                        </Box>
                    </Block>
                    <Block title="Inactive sites">
                        <Box component="span" sx={boxStyle}>
                            {sitesActivity.length - activeSitesCount} (
                            {100 - Math.round((100 * activeSitesCount) / sitesActivity.length)} %)
                        </Box>
                    </Block>
                </Box>
                <AgChartsReact options={{ ...activityByGeoLocationOptions, data: activityByGeoLocation }} />
                <AgChartsReact options={{ ...topSitesByPageViewOptions, data: topSitesByPageView }} />
            </div>
            <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <div style={{ width: '50vw', height: '100vh' }}>
                    <SitesList sites={sitesActivity} />
                </div>
            </Drawer>
        </>
    )
}
