export const graphLinks = {
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
    application: 'https://graph.microsoft.com/v1.0/applications',
    groups: 'https://graph.microsoft.com/v1.0/groups',
    groupMembers: (id: string) => `https://graph.microsoft.com/v1.0/groups/${id}/members`,
    groupOwners: (id: string) => `https://graph.microsoft.com/v1.0/groups/${id}/owners`,
    users: 'https://graph.microsoft.com/v1.0/users',
    deletedUsers: 'https://graph.microsoft.com/beta/directory/deletedItems/microsoft.graph.user',
    token: 'https://ms-dashboard-ccecc603061b.herokuapp.com/token',
}
