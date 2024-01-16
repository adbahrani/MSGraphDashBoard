import { useEffect, useState } from 'react'
import { Block } from '../components/shared/Block'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { periods } from '../constants'
import { ExchangeService, MailBoxUsageDetail } from '../services/exchange'
import { formatBytestToGB } from '../utils/helpers'
import { ExchangeList } from '../components/ExchangeList'
import { PeriodValueInDays } from '../types/general'
import { columnDefExchanges } from '../columnsDef/exchange'
import { BoxLoader } from '../components/shared/Loaders/BoxLoader'

class ExchangeStats {
    totalMailboxesCount: number = 0
    activeMailboxesCount: number = 0
    inactiveMailboxesCount: number = 0
    activeVersusTotalMailboxes: string = ''
    totalStorage: string = ''
    sharedMailboxesCount: number = 0
    resourceMailboxesCount: number = 0
    totalContactsCount: number = 0
    emailReadsCount: number = 0
    emailReceivedCount: number = 0
    emailSentCount: number = 0
    activeUsers: number = 0
    outlookMobile: number = 0
    outlookWindows: number = 0
    outlookWeb: number = 0
    outlookOther: number = 0
}

export const Exchange = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodValueInDays>(30)

    const [isLoading, setIsLoading] = useState(true)

    const [activityDetails, setActivityDetails] = useState<MailBoxUsageDetail[]>([])

    const [statsDataFromApi, setStatsDataFromApi] = useState<ExchangeStats>(new ExchangeStats())
    const boxStyle = { display: 'flex', flex: 1, justifyContent: 'center', fontSize: 16, fontWeight: 'bold' }

    const setPageData = async () => {
        setIsLoading(true)
        const {
            mailSettingData,
            emailActivityUserDetails,
            totalStorageUsedInBytes,
            groupByActivityCounts,
            activeVersusTotalMailboxes,
            deviceData,
            totalMailboxesCount,
            userUsageDetails,
        } = await ExchangeService.exchangePageData({ selectedPeriod })

        setIsLoading(false)
        setActivityDetails(userUsageDetails)

        setStatsDataFromApi(val => ({
            ...val,
            resourceMailboxesCount: mailSettingData.filter(val => val.userPurpose !== 'shared').length,
            totalContactsCount: mailSettingData.length,
            emailReadsCount: emailActivityUserDetails.reduce((acc, val) => acc + val.readCount, 0),
            emailReceivedCount: emailActivityUserDetails.reduce((acc, val) => acc + val.receiveCount, 0),
            emailSentCount: emailActivityUserDetails.reduce((acc, val) => acc + val.sendCount, 0),
            totalStorage: formatBytestToGB(totalStorageUsedInBytes, 1),
            inactiveMailboxesCount: groupByActivityCounts.inactiveMailboxesCount,
            activeMailboxesCount: groupByActivityCounts.activeMailboxesCount,
            totalMailboxesCount: totalMailboxesCount,
            activeVersusTotalMailboxes: activeVersusTotalMailboxes,
            activeUsers: emailActivityUserDetails.filter(val => val.lastActivityDate, 0).length,
            outlookOther: deviceData.outlookOther,
            outlookWeb: deviceData.outlookWeb,
            outlookWindows: deviceData.outlookWindows,
            outlookMobile: deviceData.outlookMobile,
        }))
    }
    useEffect(() => {
        setPageData()
    }, [selectedPeriod])

    const statsData = [
        { title: 'Total Mailboxes Count', value: statsDataFromApi.totalMailboxesCount },
        { title: 'Active Mailboxes Count', value: statsDataFromApi.activeMailboxesCount },
        { title: 'Inactive Mailboxes Count', value: statsDataFromApi.inactiveMailboxesCount },
        { title: 'Active vs Total Mailboxes', value: statsDataFromApi.activeVersusTotalMailboxes },
        { title: 'Total Storage (GB)', value: statsDataFromApi.totalStorage },
        { title: 'Shared Mailboxes Count', value: statsDataFromApi.sharedMailboxesCount },
        { title: 'Resource Mailboxes Count', value: statsDataFromApi.resourceMailboxesCount },
        { title: 'Total Contacts Count', value: statsDataFromApi.totalContactsCount },
        { title: 'Email Reads Count', value: statsDataFromApi.emailReadsCount },
        { title: 'Email Received Count', value: statsDataFromApi.emailReceivedCount },
        { title: 'Email Sent Count', value: statsDataFromApi.emailSentCount },
        { title: 'Active Users', value: statsDataFromApi.activeUsers },
        { title: 'Outlook Mobile', value: statsDataFromApi.outlookMobile },
        { title: 'Outlook Windows', value: statsDataFromApi.outlookWindows },
        { title: 'Outlook Web', value: statsDataFromApi.outlookWeb },
        { title: 'Outlook other', value: statsDataFromApi.outlookOther },
    ]

    return (
        <>
            <div style={{}}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    {periods.map(period => (
                        <Chip
                            key={period.value}
                            label={period.label}
                            variant={selectedPeriod === period.value ? 'filled' : 'outlined'}
                            onClick={() => setSelectedPeriod(period.value)}
                        />
                    ))}
                </div>
                {isLoading ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <BoxLoader numberOfBoxes={16} boxHeight="8rem" boxWidth="23%" />
                    </div>
                ) : (
                    <Box
                        component="div"
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr 1fr',
                            gap: '8px',
                        }}
                    >
                        {statsData.map(dt => (
                            <Block key={dt.title} title={dt.title}>
                                <Box component="span" sx={boxStyle}>
                                    {dt.value}
                                </Box>
                            </Block>
                        ))}
                    </Box>
                )}

                <Box component="div" sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)' }}>
                    <Block title="Mailbox logs">
                        <ExchangeList
                            columnDefs={columnDefExchanges}
                            height="25rem"
                            width="100%"
                            exchanges={activityDetails}
                            isLoading={isLoading}
                        />
                    </Block>
                </Box>
            </div>
        </>
    )
}
