import { useEffect, useState } from 'react'
import { Stats } from '../components/shared/Stats'
import { PieData } from '../components/shared/PieData'
import { Group, GroupsService } from '../services/groups'
import { GroupAggKey, aggregateGroups, groupLabelDisplayMap } from '../utils/groups'
import { GroupsList } from '../components/GroupsList'
import { ColDef } from 'ag-grid-community'
import { BoxLoader } from '../components/shared/Loaders/BoxLoader'
import { Block } from '../components/shared/Block'
import './Groups.css'
import { Box, Container } from '@mui/material'

export const Groups = () => {
    const [isLoadingGroups, setIsLoadingGroups] = useState(true)
    const [isLoadingDeletedGroups, setIsLoadingDeletedGroups] = useState(true)
    const [groups, setGroups] = useState<Array<Group>>([])
    const [deletedGroups, setDeletedGroups] = useState<Array<Group>>([])
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
            console.log('error while loading groups data is', e)
        }
    }

    async function setDeletedGroupData() {
        try {
            setDeletedGroups(await GroupsService.getAllDeletedGroups())
            setIsLoadingDeletedGroups(false)
        } catch (e) {
            console.log('error while loading deleting groups is', e)
        }
    }
    useEffect(() => {
        setGroupData()
        setDeletedGroupData()
    }, [])

    const columnDefGroups: ColDef[] = [
        { field: 'displayName', headerName: 'Display Name', width: 200 },
        { field: 'description', headerName: 'Description', flex: 12, minWidth: 300 },
        {
            field: 'owners',
            valueFormatter: params => {
                return params.value.length
            },
            headerName: 'Owners',
            flex: 4,
            minWidth: 120,
        },
        {
            field: 'members',
            valueFormatter: params => {
                return params.value.length
            },
            headerName: 'Members',
            flex: 4,
            minWidth: 130,
        },
        {
            headerName: 'Guest',
            field: 'members',
            valueFormatter: params => {
                return params.value.filter((val: any) => val.userType === 'Guest').length
            },
            flex: 4,
            minWidth: 110,
        },
        {
            field: 'visibility',
            headerName: 'Visibility',
            flex: 4,
            minWidth: 120,
        },
        {
            headerName: 'Team Status',
            field: 'resourceProvisioningOptions',
            valueFormatter: params => {
                return params.value.includes('Team') ? 'Team Connected' : ''
            },
            flex: 4,
            minWidth: 130,
        },
        {
            field: 'membershipRule',
            headerName: 'Membership Rule',
            flex: 4,
            minWidth: 130,
        },
        {
            field: 'createdDateTime',
            valueFormatter: params => {
                return params.value ? new Date(params.value).toLocaleString() : ''
            },
            headerName: 'Created At',
            flex: 4,
            minWidth: 120,
        },
        {
            field: 'renewedDateTime',
            headerName: 'Last Activity',
            valueFormatter: params => {
                return params.value ? new Date(params.value).toLocaleString() : ''
            },
            flex: 4,
            minWidth: 120,
        },
    ]

    const columnDefDeletedGroups: ColDef[] = [
        { field: 'displayName', headerName: 'Display Name', width: 180 },
        { field: 'description', headerName: 'Description', flex: 10, minWidth: 150 },
        {
            field: 'visibility',
            headerName: 'Visibility',
            minWidth: 120,
            flex: 4,
        },
        {
            field: 'deletedDateTime',
            headerName: 'Deleted At',
            valueFormatter: params => {
                return params.value ? new Date(params.value).toLocaleString() : ''
            },
            minWidth: 120,
            flex: 4,
        },
        {
            field: 'expirationDateTime',
            headerName: 'Expiration Time',
            valueFormatter: params => {
                return params.value ? new Date(params.value).toLocaleString() : ''
            },
            minWidth: 120,
            flex: 4,
        },
    ]

    return (
        <Container sx={{ padding: 5 }} maxWidth="xl">
            {isLoadingGroups ? (
                <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                    <BoxLoader numberOfBoxes={10} boxHeight="8rem" boxWidth="18%" />
                </Box>
            ) : (
                <Stats stats={stats} />
            )}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginTop: '2rem',
                }}
            >
                <Block additionalStyles={{ pt: 0 }}>
                    <GroupsList
                        columnDefs={columnDefGroups}
                        height="25rem"
                        width="100%"
                        groups={groups}
                        isLoading={isLoadingGroups}
                    />
                </Block>
                <Box className="GroupBottomContainer">
                    <Box className="GroupBottomTable">
                        <Block additionalStyles={{ pt: 0, flex: 1, height: '100%' }}>
                            <GroupsList
                                columnDefs={columnDefDeletedGroups}
                                height="100%"
                                width="100%"
                                groups={deletedGroups}
                                isLoading={isLoadingDeletedGroups}
                            />
                        </Block>
                    </Box>
                    <Box className="GroupBottomChart">
                        <PieData
                            additionalBlockStyles={{
                                height: '100%',
                                boxSizing: 'border-box',
                            }}
                            height={300}
                            title="Groups per Connection"
                            data={pieData}
                            property="connection"
                            fills={['#8bd4eb', '#808080']}
                        />
                    </Box>
                    <Box className="GroupBottomChart">
                        <PieData
                            height={300}
                            additionalBlockStyles={{
                                height: '100%',
                                boxSizing: 'border-box',
                            }}
                            title="Groups per Visibility"
                            data={pieData}
                            property="visibility"
                            fills={['#fb8281', '#5f6b6d', '#4bc5bc']}
                        />
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}
