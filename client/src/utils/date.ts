

export function formatDate(dateString: string) {
    return dateString.slice(0, dateString.indexOf('Z')).replace('T', ' ')
}