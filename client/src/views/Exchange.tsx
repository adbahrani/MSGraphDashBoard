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

class TypeOfStatsData {
    public data: string
    constructor() {
        this.data = ''
    }

    setData(data: string | number) {
        this.data = typeof data === 'number' ? data.toString() : data
        return this
    }
}

export const Exchange = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodValueInDays>(30)

    const [isLoading, setIsLoading] = useState(true)

    const [activityDetails, setActivityDetails] = useState<MailBoxUsageDetail[]>([])

    const [statsDataFromApi, setStatsDataFromApi] = useState({
        totalMailboxesCount: new TypeOfStatsData(),
        activeMailboxesCount: new TypeOfStatsData(),
        inactiveMailboxesCount: new TypeOfStatsData(),
        activeVersusTotalMailboxes: new TypeOfStatsData(),
        totalStorage: new TypeOfStatsData(),
        sharedMailboxesCount: new TypeOfStatsData(),
        resourceMailboxesCount: new TypeOfStatsData(),
        totalContactsCount: new TypeOfStatsData(),
        emailReadsCount: new TypeOfStatsData(),
        emailReceivedCount: new TypeOfStatsData(),
        emailSentCount: new TypeOfStatsData(),
        activeUsers: new TypeOfStatsData(),
        outlookMobile: new TypeOfStatsData(),
        outlookWindows: new TypeOfStatsData(),
        outlookWeb: new TypeOfStatsData(),
        outlookOther: new TypeOfStatsData(),
    })
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
            sharedMailboxesCount: val.sharedMailboxesCount.setData(
                mailSettingData.filter(val => val.userPurpose === 'shared').length
            ),
            resourceMailboxesCount: val.resourceMailboxesCount.setData(
                mailSettingData.filter(val => val.userPurpose !== 'shared').length
            ),
            totalContactsCount: val.totalContactsCount.setData(mailSettingData.length),
            emailReadsCount: val.emailReadsCount.setData(
                emailActivityUserDetails.reduce((acc, val) => acc + val.readCount, 0)
            ),
            emailReceivedCount: val.emailReceivedCount.setData(
                emailActivityUserDetails.reduce((acc, val) => acc + val.receiveCount, 0)
            ),
            emailSentCount: val.emailSentCount.setData(
                emailActivityUserDetails.reduce((acc, val) => acc + val.sendCount, 0)
            ),
            totalStorage: val.totalStorage.setData(formatBytestToGB(totalStorageUsedInBytes, 1)),
            inactiveMailboxesCount: val.inactiveMailboxesCount.setData(groupByActivityCounts.inactiveMailboxesCount),
            activeMailboxesCount: val.activeMailboxesCount.setData(groupByActivityCounts.activeMailboxesCount),
            totalMailboxesCount: val.totalMailboxesCount.setData(totalMailboxesCount),
            activeVersusTotalMailboxes: val.activeVersusTotalMailboxes.setData(`${activeVersusTotalMailboxes} %`),
            activeUsers: val.activeUsers.setData(
                emailActivityUserDetails.filter(val => val.lastActivityDate, 0).length
            ),
            outlookMobile: val.outlookMobile.setData(deviceData.outlookMobile),
            outlookOther: val.outlookOther.setData(deviceData.outlookOther),
            outlookWeb: val.outlookWeb.setData(deviceData.outlookWeb),
            outlookWindows: val.outlookWindows.setData(deviceData.outlookWindows),
        }))
    }
    useEffect(() => {
        setPageData()
    }, [selectedPeriod])

    const statsData = [
        { title: 'Total Mailboxes Count', value: statsDataFromApi.totalMailboxesCount.data },
        { title: 'Active Mailboxes Count', value: statsDataFromApi.activeMailboxesCount.data },
        { title: 'Inactive Mailboxes Count', value: statsDataFromApi.inactiveMailboxesCount.data },
        { title: 'Active vs Total Mailboxes', value: statsDataFromApi.activeVersusTotalMailboxes.data },
        { title: 'Total Storage (GB)', value: statsDataFromApi.totalStorage.data },
        { title: 'Shared Mailboxes Count', value: statsDataFromApi.sharedMailboxesCount.data },
        { title: 'Resource Mailboxes Count', value: statsDataFromApi.resourceMailboxesCount.data },
        { title: 'Total Contacts Count', value: statsDataFromApi.totalContactsCount.data },
        { title: 'Email Reads Count', value: statsDataFromApi.emailReadsCount.data },
        { title: 'Email Received Count', value: statsDataFromApi.emailReceivedCount.data },
        { title: 'Email Sent Count', value: statsDataFromApi.emailSentCount.data },
        { title: 'Active Users', value: statsDataFromApi.activeUsers.data },
        { title: 'Outlook Mobile', value: statsDataFromApi.outlookMobile.data },
        { title: 'Outlook Windows', value: statsDataFromApi.outlookWindows.data },
        { title: 'Outlook Web', value: statsDataFromApi.outlookWeb.data },
        { title: 'Outlook other', value: statsDataFromApi.outlookOther.data },
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
