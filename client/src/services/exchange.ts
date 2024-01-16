import { Office365GroupsActivityFileCounts, Office365GroupsActivityDetail } from '@microsoft/microsoft-graph-types-beta'
import { graphAPIUrls } from '../graphHelper'
import { makeGraphAPICall } from './base'
import { UsersService } from './users'
import { PeriodValueInDays } from '../types/general'

export interface MailBoxUsageDetail {
    reportRefreshDate: string
    userPrincipalName: string
    displayName: string
    isDeleted: boolean
    deletedDate: string | null
    createdDate: string
    lastActivityDate: string | null
    itemCount: number
    storageUsedInBytes: number
    deletedItemCount: number
    deletedItemSizeInBytes: number
    deletedItemQuota: number
    hasArchive: boolean
    recipientType: string
    issueWarningQuotaInBytes: number
    prohibitSendQuotaInBytes: number
    prohibitSendReceiveQuotaInBytes: number
    reportPeriod: string
}

interface EmailActivityUserDetail {
    reportRefreshDate: string
    userPrincipalName: string
    displayName: string
    isDeleted: boolean
    deletedDate: string | null
    lastActivityDate: string
    sendCount: number
    receiveCount: number
    readCount: number
    meetingCreatedCount: number
    meetingInteractedCount: number
    assignedProducts: string[]
    reportPeriod: string
}

interface EmailAppUserCount {
    reportRefreshDate: string
    mailForMac: null | number
    outlookForMac: null | number
    outlookForWindows: null | number
    outlookForMobile: null | number
    otherForMobile: null | number
    outlookForWeb: number
    pop3App: null | number
    imap4App: null | number
    smtpApp: null | number
    reportPeriod: string
}

interface Storage {
    reportRefreshDate: string
    storageUsedInBytes: number
    reportDate: string
    reportPeriod: string
}

interface MailboxSettings {
    '@odata.context': string
    archiveFolder: string
    timeZone: string
    delegateMeetingMessageDeliveryOptions: string
    dateFormat: string
    timeFormat: string
    userPurpose: string
    userPurposeV2: string
    automaticRepliesSetting: {
        status: string
        externalAudience: string
        internalReplyMessage: string
        externalReplyMessage: string
        scheduledStartDateTime: {
            dateTime: string
            timeZone: string
        }
        scheduledEndDateTime: {
            dateTime: string
            timeZone: string
        }
    }
    language: {
        locale: string
        displayName: string
    }
    workingHours: {
        daysOfWeek: string[]
        startTime: string
        endTime: string
        timeZone: {
            name: string
        }
    }
}

export class ExchangeService {
    public static async getTotalMailBoxUsageCounts(period: PeriodValueInDays) {
        const mailBoxUsages: {
            value: Office365GroupsActivityFileCounts[]
        } = await makeGraphAPICall(graphAPIUrls.mailBoxUsageCounts(period))
        return mailBoxUsages.value
    }

    public static async getEmailUsageUserDetails(period: PeriodValueInDays) {
        const mailBoxUsageDetails: {
            value: Office365GroupsActivityDetail[]
        } = await makeGraphAPICall(graphAPIUrls.emailUsageUserDetails(period))
        return mailBoxUsageDetails.value
    }

    public static async getTotalStorageUsed(period: PeriodValueInDays) {
        const storageUsed: {
            value: Storage[]
        } = await makeGraphAPICall(graphAPIUrls.totalStorageUsed(period))
        return storageUsed.value
    }

    public static async getMailboxSettings() {
        const allUsers = await UsersService.getAll()
        const ids = allUsers.reduce<string[]>((acc, val) => {
            if (!val.accountEnabled) {
                return acc
            }
            return [...acc, val.id]
        }, [])
        const mailSettingData = await Promise.allSettled(
            ids.map(id => makeGraphAPICall(graphAPIUrls.userMailBoxSettings(id), 'GET'))
        )
        return mailSettingData.reduce<MailboxSettings[]>((acc, dt) => {
            if (dt.status === 'fulfilled') {
                return [...acc, dt.value]
            }
            return acc
        }, [])
    }

    public static async getEmailActivityUserDetail(period: PeriodValueInDays) {
        const emailActivity: {
            value: EmailActivityUserDetail[]
        } = await makeGraphAPICall(graphAPIUrls.getEmailActivityUserDetail(period))
        return emailActivity.value
    }

    public static async getEmailAppUsageAppsUserCounts(period: PeriodValueInDays) {
        const appUserCounts: {
            value: EmailAppUserCount[]
        } = await makeGraphAPICall(graphAPIUrls.getEmailAppUsageAppsUserCounts(period))
        return appUserCounts.value
    }

    public static async getMailboxUsageDetail(period: PeriodValueInDays) {
        const usage: {
            value: MailBoxUsageDetail[]
        } = await makeGraphAPICall(graphAPIUrls.getMailboxUsageDetail(period))
        return usage.value
    }

    public static async exchangePageData({ selectedPeriod }: { selectedPeriod: PeriodValueInDays }) {
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

        const emailUsageUserDetails =
            emailUsageUserDetailsResult.status === 'fulfilled' ? emailUsageUserDetailsResult.value : []

        const totalStorageUsed = totalStorageUsedResult.status === 'fulfilled' ? totalStorageUsedResult.value : []

        const emailActivityUserDetails =
            emailActivityUserDetailResult.status === 'fulfilled' ? emailActivityUserDetailResult.value : []

        const userUsageDetails = mailboxUsageResult.status === 'fulfilled' ? mailboxUsageResult.value : []

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

        return {
            deviceData,
            mailSettingData,
            totalStorageUsedInBytes,
            activeVersusTotalMailboxes,
            userUsageDetails,
            emailActivityUserDetails,
            groupByActivityCounts,
            totalMailboxesCount,
        }
    }
}
