import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { DriveOneService, OneDriveActivity } from '../services/one-drive'
import { DrivesList } from '../components/DrivesList'
import { Stats } from '../components/shared/Stats'
import { AgChartsReact } from 'ag-charts-react'
import { periods } from '../constants'
import { Stat } from '../components/shared/Stat'
import { Container, Typography } from '@mui/material'
import { formatBytes } from '../utils/helpers'

type OneDriveStats = {
    syncedFiles: number
    sharedInternally: number
    sharedExternally: number
    totalUsedStorage: number | string
}

export const OneDrive = () => {
    const [oneDriveActivity, setOneDriveActivity] = useState<Array<OneDriveActivity>>([])
    const [activeDrivesCount, setActiveDrivesCount] = useState(0)
    const [oneDriveStats, setOneDriveStats] = useState<OneDriveStats>()

    const [selectedPeriod, setSelectedPeriod] = useState<30 | 90>(30)

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
        const stats: OneDriveStats = {
            syncedFiles: 0,
            sharedInternally: 0,
            sharedExternally: 0,
            totalUsedStorage: 0,
        }

        DriveOneService.getActivity(selectedPeriod).then(oneDriveActivity => {
            setOneDriveActivity(oneDriveActivity)

            oneDriveActivity.forEach(
                a => (stats.totalUsedStorage = Number(stats.totalUsedStorage) + a.storageUsedInBytes)
            )
            stats.totalUsedStorage = formatBytes(Number(stats.totalUsedStorage))
            const minDate = new Date()
            minDate.setDate(minDate.getDate() - selectedPeriod)
            console.log('Inactive: ', oneDriveActivity.length)
            setActiveDrivesCount(
                oneDriveActivity.filter(
                    ({ lastActivityDate }) => lastActivityDate && new Date(lastActivityDate) >= minDate
                ).length
            )
        })

        DriveOneService.getUserActivity(selectedPeriod).then(userActivity => {
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
                    influencers.push({
                        userName: userPrincipalName,
                        sync: syncedFileCount,
                        share: sharedExternallyFileCount + sharedInternallyFileCount,
                        viewEdit: viewedOrEditedFileCount,
                    })
                }
            )
            setOneDriveStats(stats)
            setInfluencersData(
                influencers
                    .sort((i1, i2) => i2.sync + i2.share + i2.viewEdit - (i1.sync + i1.share + i1.viewEdit))
                    .slice(0, 5)
            )
        })
    }, [selectedPeriod])

    return (
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center', my: 3 }}>
                <Typography
                    sx={{
                        fontSize: 40,
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        minHeight: '60px',
                        paddingTop: '15px',
                    }}
                    color="text.secondary"
                    align={'center'}
                >
                    {oneDriveActivity.length}
                </Typography>
                <Typography
                    sx={{
                        fontSize: 22,
                        fontWeight: 500,
                        lineHeight: '100%',
                        textTransform: 'capitalize',
                    }}
                    color="text.secondary"
                    align={'center'}
                >
                    SITE COUNTS
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'center', my: 3 }}>
                {periods.map(period => (
                    <Chip
                        key={period.value}
                        label={period.label}
                        variant={selectedPeriod === period.value ? 'filled' : 'outlined'}
                        onClick={() => setSelectedPeriod(period.value)}
                    />
                ))}
            </Box>
            <Box component="div" sx={{ display: 'flex', gap: '8px' }}>
                <Stat
                    title="Active sites"
                    value={`${activeDrivesCount} (${Math.round(
                        (100 * activeDrivesCount) / oneDriveActivity.length
                    )} %)`}
                />
                <Stat
                    title="Inactive sites"
                    value={`${oneDriveActivity.length - activeDrivesCount} (${
                        100 - Math.round((100 * activeDrivesCount) / oneDriveActivity.length)
                    }%)`}
                />
            </Box>
            {oneDriveStats && <Stats stats={oneDriveStats} numberOfColumns={Object.keys(oneDriveStats).length} />}
            <Box style={{ width: '100%', height: '100vh' }}>
                <DrivesList drives={oneDriveActivity} />
            </Box>

            <AgChartsReact options={{ ...influencersOptions, data: influencersData }} />
        </Container>
    )
}
