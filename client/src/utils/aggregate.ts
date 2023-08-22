export function countByProperty<T extends { [key: string]: any }>(data: Array<T>, property: string) {
    const countByProperty: { [propValue: string]: number } = {}
    for (const entry of data) {
        const propValue = entry[property] || 'Blank'
        if (!countByProperty[propValue]) {
            countByProperty[propValue] = 0
        }
        countByProperty[propValue]++
    }

    return countByProperty
}
