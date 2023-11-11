import { useEffect, useState } from 'react'
import { Menu } from '../components/Menu'
import { Block } from '../components/shared/Block'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { DriveOneService, OneDriveActivity } from '../services/one-drive'
import { DrivesList } from '../components/DrivesList'
import { Stats } from '../components/shared/Stats'
import { AgChartsReact } from 'ag-charts-react'

export const OneDrive = () => {
    const [oneDriveActivity, setOneDriveActivity] = useState<Array<OneDriveActivity>>([])
    const [activeDrivesCount, setActiveDrivesCount] = useState(0)
    const [userActivityStats, setUserActivityStats] = useState({
        syncedFiles: 0,
        sharedInternally: 0,
        sharedExternally: 0,
        viewsEdits: 0,
    })

    const periods = [
        { label: 'Last 30 days', value: 30 },
        { label: 'Last 90 days', value: 90 },
    ] as const

    const [selectedPeriod, setSelectedPeriod] = useState<30 | 90>(30)
    const boxStyle = { display: 'flex', flex: 1, justifyContent: 'center', fontSize: 16, fontWeight: 'bold' }

    const [influencersData, setInfluencersData] = useState<
        Array<{
            userName: string
            sync: number
            share: number
            viewEdit: number
        }>
    >([])
    const influencersOptions = {
        title: {
            text: 'Top 5 influencers',
        },
        series: [
            {
                type: 'column' as const,
                xKey: 'userName',
                yKey: 'sync',
                yName: 'Sync',
                stacked: true,
            },
            {
                type: 'column' as const,
                xKey: 'userName',
                yKey: 'share',
                yName: 'Share',
                stacked: true,
            },
            {
                type: 'column' as const,
                xKey: 'userName',
                yKey: 'viewEdit',
                yName: 'View/Edit',
                stacked: true,
            },
        ],
    }

    useEffect(() => {
        DriveOneService.getActivity(selectedPeriod).then(oneDriveActivity => {
            setOneDriveActivity(oneDriveActivity)

            const minDate = new Date()
            minDate.setDate(minDate.getDate() - selectedPeriod)

            setActiveDrivesCount(
                oneDriveActivity.filter(
                    ({ lastActivityDate }) => lastActivityDate && new Date(lastActivityDate) >= minDate
                ).length
            )
        })

        DriveOneService.getUserActivity(selectedPeriod).then(userActivity => {
            const stats = { syncedFiles: 0, sharedInternally: 0, sharedExternally: 0, viewsEdits: 0 }
            const influencers: typeof influencersData = []
            userActivity.forEach(
                ({
                    userPrincipalName,
                    syncedFileCount,
                    sharedExternallyFileCount,
                    sharedInternallyFileCount,
                    viewedOrEditedFileCount,
                }) => {
                    stats.syncedFiles += syncedFileCount
                    stats.sharedInternally += sharedInternallyFileCount
                    stats.sharedExternally += sharedExternallyFileCount
                    stats.viewsEdits += viewedOrEditedFileCount
                    influencers.push({
                        userName: userPrincipalName,
                        sync: syncedFileCount,
                        share: sharedExternallyFileCount + sharedInternallyFileCount,
                        viewEdit: viewedOrEditedFileCount,
                    })
                }
            )
            setUserActivityStats(stats)
            setInfluencersData(
                influencers
                    .sort((i1, i2) => i2.sync + i2.share + i2.viewEdit - (i1.sync + i1.share + i1.viewEdit))
                    .slice(0, 5)
            )
        })
    }, [selectedPeriod])

    return (
        <>
            <div style={{ padding: '80px 64px 0' }}>
                <Block title="Sites count">
                    <Box component="span" sx={boxStyle}>
                        {oneDriveActivity.length}
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
                            {activeDrivesCount} ({Math.round((100 * activeDrivesCount) / oneDriveActivity.length)} %)
                        </Box>
                    </Block>
                    <Block title="Inactive sites">
                        <Box component="span" sx={boxStyle}>
                            {oneDriveActivity.length - activeDrivesCount} (
                            {100 - Math.round((100 * activeDrivesCount) / oneDriveActivity.length)} %)
                        </Box>
                    </Block>
                </Box>

                <Stats stats={userActivityStats} />

                <AgChartsReact options={{ ...influencersOptions, data: influencersData }} />

                <div style={{ width: 'calc(100vw - 128px)', height: '100vh' }}>
                    <DrivesList drives={oneDriveActivity} />
                </div>
            </div>
        </>
    )
}
