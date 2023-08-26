import { graphLinks } from '../graphHelper'
import { BaseService } from './base'
import { TokenService } from './token'

export type ReportType = 'getTeamsTeamCounts' | 'getTeamsTeamActivityCounts' | 'getTeamsUserActivityCounts'

export class ReportsService extends BaseService {
    public static async download(reportType: ReportType, period = 30) {
        const token = await TokenService.getToken()
        const fileName = `${reportType}-${period}-days-${new Date().toISOString()}.csv`
        return fetch(`${graphLinks.report}?reportType=${reportType}&period=${period}&token=${token}`)
            .then(response => response.blob())
            .then(blob => {
                const tempLink = document.createElement('a')
                tempLink.download = fileName
                tempLink.href = window.URL.createObjectURL(blob)
                tempLink.click()
                tempLink.remove()
            })
    }
}
