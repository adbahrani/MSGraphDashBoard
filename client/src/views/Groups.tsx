import { useEffect, useMemo, useState } from 'react'
import { Stats } from '../components/shared/Stats'
import { PieData } from '../components/shared/PieData'
import { Menu } from '../components/Menu'
import { Group, GroupsService } from '../services/groups'
import { aggregateGroups } from '../utils/groups'
import { GroupsList } from '../components/GroupsList'
import { ColDef } from 'ag-grid-community'

export const Groups = () => {
    const [groups, setGroups] = useState<Array<Group>>([])
    const [stats, setStats] = useState({})
    const [pieData, setPieData] = useState<Array<{ connection: string; visibility: string | null }>>([])

    async function setGroupData() {
        try {
            const groups = await GroupsService.getAllGroupByOwnersAndMembers()
            const aggregatedGroups = aggregateGroups(groups)
            setGroups(groups)
            setStats(
                Object.entries(aggregatedGroups).reduce<{ [key: string]: number }>((acc, [key, values]) => {
                    if (key !== 'others') {
                        acc[key] = values.length
                    }
                    return acc
                }, {})
            )
            setPieData(
                groups.map(group => ({
                    connection: group.resourceProvisioningOptions.includes('Team') ? 'Connected' : 'Not-connected',
                    visibility: group.visibility,
                }))
            )
        } catch (e) {
            console.log('error is', e);
        }
    }
    useEffect(() => {
        setGroupData()
    }, [])

    const deletedGroups = useMemo(() => {
        return groups.filter(group => group.deletedDateTime)
    }, [groups])

    const columnDefGroups: ColDef[] = [{ field: 'displayName' }, { field: 'description' }, {
        field: 'owners', valueFormatter: params => {
            return params.value.length
        },
        width: 120
    }, {
        field: 'members', valueFormatter: params => {
            return params.value.length
        },
        width: 120

    }, {
        headerName: 'Guest', field: 'members', valueFormatter: params => {
            return params.value.filter((val: any) => val.userType === 'Guest').length
        },
        width: 120

    }, {
        field: 'visibility',
        width: 180
    }, {
        headerName: 'Team Status',
        field: 'resourceProvisioningOptions',
        valueFormatter: params => {
            return params.value.includes("Team") ? "Team Connected" : ""
        },
        width: 180
    }, {
        field: 'membershipRule',
        headerName: 'Membership Rule',
        width: 180
    }, {
        field: 'createdDateTime',
        width: 220
    }, {
        field: 'renewedDateTime',
        width: 220
    }]



    const columnDefDeletedGroups: ColDef[] = [{ field: 'displayName' }, { field: 'description' },{
        field: 'visibility'
    }, {
        field: 'deletedDateTime'
    },  {
        field: 'expirationDateTime'
    }]


    return (
        <>
            <div style={{ padding: '80px 64px 0' }}>
                <Stats stats={stats} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >

                    <GroupsList columnDefs={columnDefGroups} height='400px' width='100%' groups={groups} />

                    <GroupsList columnDefs={columnDefDeletedGroups} height='400px' width='60%' groups={deletedGroups} />

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div>
                            <PieData
                                title="Groups per Connection"
                                data={pieData}
                                property="connection"
                                fills={['#8bd4eb', '#808080']}
                            />
                        </div>
                        <div>
                            <PieData
                                title="Groups per Visibility"
                                data={pieData}
                                property="visibility"
                                fills={['#fb8281', '#5f6b6d', '#4bc5bc']}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
