import { useEffect, useState } from 'react'
import { Stats } from '../components/shared/Stats'
import { PieData } from '../components/shared/PieData'
import { Menu } from '../components/Menu'
import { Group, GroupsService } from '../services/groups'
import { aggregateGroups } from '../utils/groups'
import { GroupsList } from '../components/GroupsList'

export const Groups = () => {
    const [groups, setGroups] = useState<Array<Group>>([])
    const [stats, setStats] = useState({})
    const [pieData, setPieData] = useState<Array<{ connection: string; visibility: string | null }>>([])

    useEffect(() => {
        GroupsService.getAll().then(groups => {
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
        })
    }, [])

    return (
        <>
            <div style={{ padding: '80px 64px 0' }}>
                <Stats stats={stats} />
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '30% 70%',
                    }}
                >
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
                    <GroupsList groups={groups} />
                </div>
            </div>
        </>
    )
}
