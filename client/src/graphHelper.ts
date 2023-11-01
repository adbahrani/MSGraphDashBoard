export const graphLinks = {
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
    application: 'https://graph.microsoft.com/v1.0/applications',
    groups: 'https://graph.microsoft.com/v1.0/groups',
    groupMembers: (id: string) => `https://graph.microsoft.com/v1.0/groups/${id}/members`,
    groupOwners: (id: string) => `https://graph.microsoft.com/v1.0/groups/${id}/owners`,
    users: 'https://graph.microsoft.com/v1.0/users',
    usersActivity: (period: 30 | 90) =>
        `https://graph.microsoft.com/beta/reports/microsoft.graph.getTeamsUserActivityUserDetail(period='D${period}')?$format=application/json`,
    teams: `https://graph.microsoft.com/v1.0/groups?$filter=groupTypes/any(c:c+eq+'Unified') and (resourceProvisioningOptions/Any(x:x eq 'Team'))`,
    teamsActivity: (period: 30 | 90) =>
        `https://graph.microsoft.com/beta/reports/microsoft.graph.getTeamsTeamActivityDetail(period='D${period}')?$format=application/json`,
    sites: `https://graph.microsoft.com/v1.0/sites/getAllSites`,
    sitesActivity: (period: 30 | 90) =>
        `https://graph.microsoft.com/beta/reports/microsoft.graph.getSharePointSiteUsageDetail(period='D${period}')?$format=application/json`,
    driveOneActivity: (period: 30 | 90) =>
        `https://graph.microsoft.com/beta/reports/microsoft.graph.getOneDriveUsageAccountDetail(period='D${period}')?$format=application/json`,
    driveOneUserActivity: (period: 30 | 90) =>
        `https://graph.microsoft.com/beta/reports/microsoft.graph.getOneDriveActivityUserDetail(period='D${period}')?$format=application/json`,
    deletedUsers: 'https://graph.microsoft.com/beta/directory/deletedItems/microsoft.graph.user',
    token: '/token',
    report: '/report',
}
