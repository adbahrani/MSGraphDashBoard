import { Group } from '../services/groups'

export type GroupAggKey = 'unified' | 'dynamic' | 'distribution' | 'security' | 'mailEnabled' | 'teamConnected' | 'public' | 'private' | 'orphaned' | 'active' | 'others'

export const groupLabelDisplayMap: {
  [key in GroupAggKey]: string
} = {
  unified: 'Unified',
  dynamic: 'Dynamic',
  distribution: 'Distribution',
  security: 'Security',
  mailEnabled: 'Mail Enabled',
  teamConnected: 'Team Connected',
  public: 'Public',
  private: 'Private',
  orphaned: 'Orphaned',
  active: 'Active',
  others: 'Others'
}
export type AggGroups = { [key in GroupAggKey]: Array<Group> }

export function aggregateGroups(groups: Array<Group>): AggGroups {
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
      ...([isMailEnabledWithoutSecurity && "distribution"]),
      ...([isMailEnabled && "mailEnabled"]),
      ...([hasDynamicMembership && 'dynamic']),
      ...([hasNoDynamicMembership && 'security']),
      ...(group.resourceProvisioningOptions.includes("Team") && ["teamConnected"] || []),
      ...(visibilityMap.has(group.visibility!) && [visibilityMap.get(group.visibility!)] || []),
      ...([group.owners?.length === 0 && "orphaned"]),
      ...([new Date(group.createdDateTime) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && "active"]),
    ].filter(val => val !== false);
  
    return outputKeys.length ? outputKeys as any[] : ["others"];
  }
  
