import { useCallback } from 'react'
import { ReportType, ReportsService } from '../services/reports'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import DownloadIcon from '@mui/icons-material/Download'
import { Box, Container } from '@mui/material'

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
            <Container maxWidth="md">
                <Stack spacing={2}>
                    {Object.entries(reportTypes).map(([reportType, title]) => (
                        <Card key={reportType} sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: 16, color: '#666' }} fontWeight="bold">
                                        {title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: '8px' }}>
                                        {periodsByReportType[reportType as ReportType].map(period => (
                                            <Chip
                                                key={`${reportType}-${period}`}
                                                icon={<DownloadIcon />}
                                                size="small"
                                                label={`${period} days`}
                                                onClick={() => download(reportType as ReportType, period)}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Container>
        </>
    )
}
