import { Office365GroupsActivityFileCounts, Office365GroupsActivityDetail } from '@microsoft/microsoft-graph-types-beta'
import { graphAPIUrls } from '../graphHelper'
import { makeGraphAPICall } from './base'
import { UsersService } from './users'

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
export class ExchangeService {
    public static async getTotalMailBoxUsageCounts(period: 30 | 90) {
        const mailBoxUsages: {
            value: Office365GroupsActivityFileCounts[]
        } = await makeGraphAPICall(graphAPIUrls.mailBoxUsageCounts(period))
        return mailBoxUsages.value
    }

    public static async getEmailUsageUserDetails(period: 30 | 90) {
        const mailBoxUsageDetails: {
            value: Office365GroupsActivityDetail[]
        } = await makeGraphAPICall(graphAPIUrls.emailUsageUserDetails(period))
        return mailBoxUsageDetails.value
    }

    public static async getTotalStorageUsed(period: 30 | 90) {
        const storageUsed: {
            value: Storage[]
        } = await makeGraphAPICall(graphAPIUrls.totalStorageUsed(period))
        return storageUsed.value
    }

    public static async getMailboxSettings() {
        const allUsers = await UsersService.getAll()
        const ids = allUsers.map(user => user.id)
        const mailSettingData = await Promise.all(
            ids.map(id => makeGraphAPICall(graphAPIUrls.userMailBoxSettings(id), 'GET', undefined, { version: 'v1' }))
        )
        return mailSettingData.map(dt => dt.value)
    }

    public static async getEmailActivityUserDetail(period: 30 | 90) {
        const emailActivity: {
            value: EmailActivityUserDetail[]
        } = await makeGraphAPICall(graphAPIUrls.getEmailActivityUserDetail(period))
        return emailActivity.value
    }

    public static async getEmailAppUsageAppsUserCounts(period: 30 | 90) {
        const appUserCounts: {
            value: EmailAppUserCount[]
        } = await makeGraphAPICall(graphAPIUrls.getEmailAppUsageAppsUserCounts(period))
        return appUserCounts.value
    }

    public static async getMailboxUsageDetail(period: 30 | 90) {
        const usage: {
            value: MailBoxUsageDetail[]
        } = await makeGraphAPICall(graphAPIUrls.getMailboxUsageDetail(period))
        return usage.value
    }
}
