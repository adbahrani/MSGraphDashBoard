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

interface TypeOfStatsData {
    totalMailboxesCount: string
    activeMailboxesCount: string
    inactiveMailboxesCount: string
    activeVersusTotalMailboxes: string
    totalStorage: string
    sharedMailboxesCount: string
    resourceMailboxesCount: string
    totalContactsCount: string
    emailReadsCount: string
    emailReceivedCount: string
    emailSentCount: string
    activeUsers: string
    outlookMobile: string
    outlookWindows: string
    outlookWeb: string
    outlookOther: string
}

export const Exchange = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodValueInDays>(30)

    const [isLoading, setIsLoading] = useState(true)

    const [activityDetails, setActivityDetails] = useState<MailBoxUsageDetail[]>([])

    const [statsDataFromApi, setStatsDataFromApi] = useState<TypeOfStatsData>({
        totalMailboxesCount: '',
        activeMailboxesCount: '',
        inactiveMailboxesCount: '',
        activeVersusTotalMailboxes: '',
        totalStorage: '',
        sharedMailboxesCount: '',
        resourceMailboxesCount: '',
        totalContactsCount: '',
        emailReadsCount: '',
        emailReceivedCount: '',
        emailSentCount: '',
        activeUsers: '',
        outlookMobile: '',
        outlookWindows: '',
        outlookWeb: '',
        outlookOther: '',
    })
    const boxStyle = { display: 'flex', flex: 1, justifyContent: 'center', fontSize: 16, fontWeight: 'bold' }

    const setPageData = async () => {
        setIsLoading(true)
        const [
            mailBoxUsageCountResult,
            emailUsageUserDetailsResult,
            emailActivityUserDetailResult,
            emailAppUserCountsResult,
            totalStorageUsedResult,
            mailboxUsageResult,
            mailboxSettingsResult,
        ] = await Promise.allSettled([
            ExchangeService.getTotalMailBoxUsageCounts(selectedPeriod),
            ExchangeService.getEmailUsageUserDetails(selectedPeriod),
            ExchangeService.getEmailActivityUserDetail(selectedPeriod),
            ExchangeService.getEmailAppUsageAppsUserCounts(selectedPeriod),
            ExchangeService.getTotalStorageUsed(selectedPeriod),
            ExchangeService.getMailboxUsageDetail(selectedPeriod),
            ExchangeService.getMailboxSettings(),
        ])
        setIsLoading(false)

        const emailUsageUserDetails =
            emailUsageUserDetailsResult.status === 'fulfilled' ? emailUsageUserDetailsResult.value : []

        const totalStorageUsed = totalStorageUsedResult.status === 'fulfilled' ? totalStorageUsedResult.value : []

        const emailActivityUserDetails =
            emailActivityUserDetailResult.status === 'fulfilled' ? emailActivityUserDetailResult.value : []

        const userUsageDetails = mailboxUsageResult.status === 'fulfilled' ? mailboxUsageResult.value : []

        setActivityDetails(userUsageDetails)

        const statsByDevice = emailAppUserCountsResult.status === 'fulfilled' ? emailAppUserCountsResult.value : []
        const groupByActivityCounts = emailUsageUserDetails.reduce(
            (acc, val) => {
                if (val.lastActivityDate) {
                    return {
                        ...acc,
                        activeMailboxesCount: acc.activeMailboxesCount + 1,
                    }
                }
                return {
                    ...acc,
                    inactiveMailboxesCount: acc.inactiveMailboxesCount + 1,
                }
            },
            {
                activeMailboxesCount: 0,
                inactiveMailboxesCount: 0,
            }
        )

        const totalMailboxesCount = emailUsageUserDetails.length
        const activeVersusTotalMailboxes = (
            (groupByActivityCounts.activeMailboxesCount / totalMailboxesCount) *
            100
        ).toFixed(2)

        const totalStorageUsedInBytes = totalStorageUsed.reduce((acc, val) => {
            return val.storageUsedInBytes + acc
        }, 0)

        const mailSettingData = mailboxSettingsResult.status === 'fulfilled' ? mailboxSettingsResult.value : []

        const deviceData = statsByDevice.reduce(
            (acc, val) => {
                const {
                    outlookForMobile,
                    outlookForWeb,
                    outlookForWindows,
                    pop3App,
                    smtpApp,
                    mailForMac,
                    outlookForMac,
                } = val
                const others = (pop3App ?? 0) + (smtpApp ?? 0) + (mailForMac ?? 0) + (outlookForMac ?? 0)
                return {
                    ...acc,
                    outlookMobile: acc.outlookMobile + (outlookForMobile ?? 0),
                    outlookWeb: acc.outlookWeb + (outlookForWeb ?? 0),
                    outlookWindows: acc.outlookWindows + (outlookForWindows ?? 0),
                    outlookOther: others,
                }
            },
            {
                outlookMobile: 0,
                outlookWeb: 0,
                outlookWindows: 0,
                outlookOther: 0,
            }
        )

        setStatsDataFromApi(val => ({
            ...val,
            sharedMailboxesCount: mailSettingData.filter(val => val.userPurpose === 'shared').length.toString(),
            resourceMailboxesCount: mailSettingData.filter(val => val.userPurpose !== 'shared').length.toString(),
            totalContactsCount: mailSettingData.length.toString(),
            emailReadsCount: emailActivityUserDetails.reduce((acc, val) => acc + val.readCount, 0).toString(),
            emailReceivedCount: emailActivityUserDetails.reduce((acc, val) => acc + val.receiveCount, 0).toString(),
            emailSentCount: emailActivityUserDetails.reduce((acc, val) => acc + val.sendCount, 0).toString(),
            totalStorage: formatBytestToGB(totalStorageUsedInBytes, 1),
            inactiveMailboxesCount: groupByActivityCounts.inactiveMailboxesCount.toString(),
            activeMailboxesCount: groupByActivityCounts.activeMailboxesCount.toString(),
            totalMailboxesCount: totalMailboxesCount.toString(),
            activeVersusTotalMailboxes: activeVersusTotalMailboxes.toString() + '%',
            activeUsers: emailActivityUserDetails.filter(val => val.lastActivityDate, 0).length.toString(),
            outlookMobile: deviceData.outlookMobile.toString(),
            outlookOther: deviceData.outlookOther.toString(),
            outlookWeb: deviceData.outlookWeb.toString(),
            outlookWindows: deviceData.outlookWindows.toString(),
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
