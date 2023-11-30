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
    }

    return aggregatedGroups
}

// function getGroupAggregationKey(group: Group): GroupAggKey[] {
//     const outputKeys: GroupAggKey[] = [];
//     if (group.groupTypes.includes('Unified')) {
//         outputKeys.push('unified')
//     }
//     if (!group.mailEnabled && group.securityEnabled) {
//         const key = group.groupTypes.includes('DynamicMembership') ? 'dynamic' : 'security'
//         outputKeys.push(key)
//     }
//     if (group.mailEnabled) {
//         if (!group.securityEnabled) outputKeys.push('distribution')
//         outputKeys.push('mailEnabled')
//     }
//     if(group.resourceProvisioningOptions.some(option => option === "Team")){
//         outputKeys.push("teamConnected")
//     }

//     if(group.visibility === "Public"){
//         outputKeys.push("public")
//     }

//     if(group.visibility === "Private"){
//         outputKeys.push("private")
//     }

//     if(group.description === null){
//         outputKeys.push("orphaned")
//     }

//     // once created in last 30 days are assumed to be active
//     if(new Date(group.createdDateTime) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)){
//         outputKeys.push('active')
//     }

//     if(outputKeys.length){
//         return outputKeys;
//     }
//     return ['others']
// }

function getGroupAggregationKey(group: Group): GroupAggKey[] {
    const keyMap = new Map([
      ["Unified", "unified"],
      ["DynamicMembership", "dynamic"],
    ]);
    const visibilityMap = new Map([
      ["Public", "public"],
      ["Private", "private"],
    ]);

    const isMailEnabled = group.mailEnabled
    const isSecurityEnabled = group.securityEnabled

    const isMailEnabledWithoutSecurity = isMailEnabled && (isSecurityEnabled === false)
    const isSecurityEnabledWithoutMail = isSecurityEnabled && (isMailEnabled === false)

    const hasDynamicMembership = isSecurityEnabledWithoutMail && group.groupTypes.includes('DynamicMembership')
    const hasNoDynamicMembership = isSecurityEnabledWithoutMail && !group.groupTypes.includes('DynamicMembership')
  
    const outputKeys = [
      ...group.groupTypes.filter((type) => keyMap.has(type)).map((type) => keyMap.get(type)),
      ...(isMailEnabledWithoutSecurity ?  ["distribution"]: []),
      ...(isMailEnabled ? ["mailEnabled"]: []),
      ...(hasDynamicMembership ? ['dynamic']: [] ),
      ...(hasNoDynamicMembership ? ['security']: [] ),
      ...(group.resourceProvisioningOptions.includes("Team") && ["teamConnected"] || []),
      ...(visibilityMap.has(group.visibility!) && [visibilityMap.get(group.visibility!)] || []),
      ...(group.owners?.length === 0 && ["orphaned"] || []),
      ...(new Date(group.createdDateTime) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && ["active"] || []),
    ];
  
    return outputKeys.length ? outputKeys as any[] : ["others"];
  }
  
