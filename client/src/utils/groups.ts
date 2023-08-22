import { Group } from '../services/groups'

export type GroupAggKey = 'unified' | 'dynamic' | 'distribution' | 'security' | 'mailEnabled' | 'others'
export type AggGroups = { [key in GroupAggKey]: Array<Group> }

export function aggregateGroups(groups: Array<Group>) {
    const aggregatedGroups: { [key in GroupAggKey]: Array<Group> } = {
        unified: [],
        dynamic: [],
        distribution: [],
        security: [],
        mailEnabled: [],
        others: [],
    }
    for (const group of groups) {
        const key = getGroupAggregationKey(group)
        aggregatedGroups[key].push(group)
    }

    return aggregatedGroups
}

function getGroupAggregationKey(group: Group): GroupAggKey {
    if (group.groupTypes.includes('Unified')) {
        return 'unified'
    }
    if (!group.mailEnabled && group.securityEnabled) {
        return group.groupTypes.includes('DynamicMembership') ? 'dynamic' : 'security'
    }
    if (group.mailEnabled) {
        if (!group.securityEnabled) return 'distribution'
        return 'mailEnabled'
    }
    return 'others'
}
