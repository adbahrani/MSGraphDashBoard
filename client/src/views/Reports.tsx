import { useCallback } from 'react'
import { Menu } from '../components/Menu'
import { ReportType, ReportsService } from '../services/reports'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import DownloadIcon from '@mui/icons-material/Download'

const reportTypes: { [type in ReportType]: string } = {
    getTeamsTeamCounts: 'Team Counts',
    getTeamsTeamActivityCounts: 'Team Activity Counts',
    getTeamsUserActivityCounts: 'User Activity Counts',
}
const periodsByReportType: { [type in ReportType]: number[] } = {
    getTeamsTeamCounts: [30, 90],
    getTeamsTeamActivityCounts: [30],
    getTeamsUserActivityCounts: [30],
}

export const Reports = () => {
    const download = useCallback(async (reportType: ReportType, period: number) => {
        await ReportsService.download(reportType, period)
    }, [])

    return (
        <>
            <div style={{ padding: '80px 64px 0' }}>
                <Stack spacing={2}>
                    {Object.entries(reportTypes).map(([reportType, title]) => (
                        <Card key={reportType} sx={{ minWidth: 275 }}>
                            <CardContent>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: 16 }} fontWeight="bold">
                                        {title}
                                    </Typography>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {periodsByReportType[reportType as ReportType].map(period => (
                                            <Chip
                                                key={`${reportType}-${period}`}
                                                icon={<DownloadIcon />}
                                                size="small"
                                                label={`${period} days`}
                                                onClick={() => download(reportType as ReportType, period)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </div>
        </>
    )
}
