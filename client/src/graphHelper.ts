export const graphLinks = {
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
    application: 'https://graph.microsoft.com/v1.0/applications',
    usersEndGuest: `https://graph.microsoft.com/v1.0/users?$filter=usertype eq 'member'`,
    usersEndMember: `https://graph.microsoft.com/v1.0/users?$filter=usertype eq 'guest'`,
    users: 'https://graph.microsoft.com/v1.0/users',
    token: '/token',
}
