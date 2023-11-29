import { Group } from '../services/groups'

export type GroupAggKey = 'unified' | 'dynamic' | 'distribution' | 'security' | 'mailEnabled' | 'teamConnected' | 'public' | 'private' | 'orphaned' | 'active' | 'others'
export type AggGroups = { [key in GroupAggKey]: Array<Group> }

export function aggregateGroups(groups: Array<Group>) {
    const aggregatedGroups: { [key in GroupAggKey]: Array<Group> } = {
        unified: [],
        dynamic: [],
        distribution: [],
        security: [],
        mailEnabled: [],
        others: [],
        teamConnected: [],
        public: [],
        private: [],
        orphaned: [],
        active: []
    }
    for (const group of groups) {
        const keys = getGroupAggregationKey(group)
        keys.forEach(key => {
            aggregatedGroups[key].push(group)
        })
        // aggregatedGroups[key].push(group)
    }

    return aggregatedGroups
}

function getGroupAggregationKey(group: Group): GroupAggKey[] {
    const outputKeys: GroupAggKey[] = [];
    if (group.groupTypes.includes('Unified')) {
        outputKeys.push('unified')
    }
    if (!group.mailEnabled && group.securityEnabled) {
        const key = group.groupTypes.includes('DynamicMembership') ? 'dynamic' : 'security'
        outputKeys.push(key)
    }
    if (group.mailEnabled) {
        if (!group.securityEnabled) outputKeys.push('distribution')
        outputKeys.push('mailEnabled')
    }
    if(group.resourceProvisioningOptions.some(option => option === "Team")){
        outputKeys.push("teamConnected")
    }

    if(group.visibility === "Public"){
        outputKeys.push("public")
    }

    if(group.visibility === "Private"){
        outputKeys.push("private")
    }

    if(group.description === null){
        outputKeys.push("orphaned")
    }

    // once created in last 30 days are assumed to be active
    if(new Date(group.createdDateTime) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)){
        outputKeys.push('active')
    }
    
    if(outputKeys.length){
        return outputKeys;
    }
    return ['others']
}
