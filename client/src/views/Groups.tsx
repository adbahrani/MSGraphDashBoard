import { useEffect, useMemo, useState } from 'react'
import { Stats } from '../components/shared/Stats'
import { PieData } from '../components/shared/PieData'
import { Group, GroupsService } from '../services/groups'
import { GroupAggKey, aggregateGroups, groupLabelDisplayMap } from '../utils/groups'
import { GroupsList } from '../components/GroupsList'
import { ColDef } from 'ag-grid-community'
import { BoxLoader } from '../components/shared/Loaders/BoxLoader'

export const Groups = () => {
    const [isLoadingGroups, setIsLoadingGroups] = useState(true)
    const [groups, setGroups] = useState<Array<Group>>([])
    const [stats, setStats] = useState({})
    const [pieData, setPieData] = useState<Array<{ connection: string; visibility: string | null }>>([])

    async function setGroupData() {
        try {
            const groups = await GroupsService.getAllGroupByOwnersAndMembers()
            const aggregatedGroups = aggregateGroups(groups)
            setGroups(groups)
            setIsLoadingGroups(false)
            setStats(
                Object.entries(aggregatedGroups).reduce<{ [key: string]: number }>((acc, [key, values]) => {
                    if (key !== 'others') {
                        const displayKey = groupLabelDisplayMap[key as GroupAggKey]
                        acc[displayKey] = values.length
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

    const columnDefGroups: ColDef[] = [{ field: 'displayName', headerName: 'Display Name' }, { field: 'description', headerName: 'Description' }, {
        field: 'owners', valueFormatter: params => {
            return params.value.length
        },
        headerName: 'Owners',
    }, {
        field: 'members', valueFormatter: params => {
            return params.value.length
        },
        headerName: 'Members',

    }, {
        headerName: 'Guest', field: 'members', valueFormatter: params => {
            return params.value.filter((val: any) => val.userType === 'Guest').length
        },

    }, {
        field: 'visibility',
        headerName: 'Visibility',
    }, {
        headerName: 'Team Status',
        field: 'resourceProvisioningOptions',
        valueFormatter: params => {
            return params.value.includes("Team") ? "Team Connected" : ""
        },
    }, {
        field: 'membershipRule',
        headerName: 'Membership Rule',
    }, {
        field: 'createdDateTime',
        headerName: 'Created At',
    }, {
        field: 'renewedDateTime',
        headerName: 'Last Activity',
    }]



    const columnDefDeletedGroups: ColDef[] = [{ field: 'displayName', headerName: 'Display Name' }, { field: 'description', headerName: 'Description' }, {
        field: 'visibility',
        headerName: 'Visibility'
    }, {
        field: 'deletedDateTime',
        headerName: 'Deleted At'
    }, {
        field: 'expirationDateTime',
        headerName: 'Expiration Time'
    }]


    return (
        <>
            <div style={{ padding: '80px 64px 0' }}>
                {isLoadingGroups ? <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <BoxLoader numberOfBoxes={10} boxHeight='8rem' boxWidth="18%" />
                </div> : <Stats stats={stats} />}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >

                    <GroupsList columnDefs={columnDefGroups} height='25rem' width='100%' groups={groups} isLoading={isLoadingGroups} />

                    <GroupsList columnDefs={columnDefDeletedGroups} height='25rem' width='60%' groups={deletedGroups} isLoading={isLoadingGroups} />

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
