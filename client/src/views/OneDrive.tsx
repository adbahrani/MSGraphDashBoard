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
import { OneDriveStats, Influencer } from '../services/one-drive'

export const OneDrive = () => {
    const [driveActivities, setDriveActivities] = useState<Array<OneDriveActivity>>([])
    const [activeDrivesCount, setActiveDrivesCount] = useState(0)
    const [oneDriveStats, setOneDriveStats] = useState<OneDriveStats>()

    const [selectedPeriod, setSelectedPeriod] = useState<30 | 90>(30)

    const [influencersData, setInfluencersData] = useState<Array<Influencer>>([])
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

    const fetchUserActivities = async () => {
        const { stats, influencers } = await DriveOneService.getUserActivity(selectedPeriod)
        setOneDriveStats(stats)
        setInfluencersData(
            influencers
                .sort((i1, i2) => i2.sync + i2.share + i2.viewEdit - (i1.sync + i1.share + i1.viewEdit))
                .slice(0, 5)
        )
    }

    const fetchDriveActivity = async () => {
        const oneDriveActivities = await DriveOneService.getActivity(selectedPeriod)

        let totalUsedStorage = 0
        oneDriveActivities.forEach(async (a: OneDriveActivity) => {
            totalUsedStorage += a.storageUsedInBytes
        })

        const minDate = new Date()
        minDate.setDate(minDate.getDate() - selectedPeriod)

        setDriveActivities(oneDriveActivities)
        setActiveDrivesCount(
            oneDriveActivities.filter(
                ({ lastActivityDate }) => lastActivityDate && new Date(lastActivityDate) >= minDate
            ).length
        )
        setOneDriveStats(prev => prev && { ...prev, totalUsedStorage: formatBytes(totalUsedStorage) })
    }
    useEffect(() => {
        fetchDriveActivity()
        fetchUserActivities()
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
                    {driveActivities.length}
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
                    value={`${activeDrivesCount} (${Math.round((100 * activeDrivesCount) / driveActivities.length)} %)`}
                />
                <Stat
                    title="Inactive sites"
                    value={`${driveActivities.length - activeDrivesCount} (${
                        100 - Math.round((100 * activeDrivesCount) / driveActivities.length)
                    }%)`}
                />
            </Box>
            {oneDriveStats && <Stats stats={oneDriveStats} numberOfColumns={Object.keys(oneDriveStats).length} />}
            <Box style={{ width: '100%', height: '100vh' }}>
                <DrivesList drives={driveActivities} />
            </Box>

            <AgChartsReact options={{ ...influencersOptions, data: influencersData }} />
        </Container>
    )
}
