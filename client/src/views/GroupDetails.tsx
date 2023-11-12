import { useEffect, useState } from 'react'
import { Stats } from '../components/shared/Stats'
import { Menu } from '../components/Menu'
import { GroupsService } from '../services/groups'
import { useSearchParams } from 'react-router-dom'
import { UsersList } from '../components/UsersList'
import { User } from '../services/users'

export const GroupDetails = () => {
    const [searchParams] = useSearchParams()
    const [members, setMembers] = useState<Array<User>>([])
    const [owners, setOwners] = useState<Array<User>>([])
    const [stats, setStats] = useState({})

    const groupId = searchParams.get('id')

    useEffect(() => {
        if (groupId) {
            GroupsService.getMembers(groupId).then(members => {
                setMembers(members)
                setStats(currStats => ({ ...currStats, members: members.length }))
            })
            GroupsService.getOwners(groupId).then(owners => {
                setOwners(owners)
                setStats(currStats => ({ ...currStats, owners: owners.length }))
            })
        }
    }, [])

    return (
        <>
            <div
                style={{
                    padding: '80px 64px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'calc(100vh - 100px)',
                }}
            >
                <Stats stats={stats} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                    }}
                >
                    <UsersList users={members} flex={2} />
                    <UsersList users={owners} />
                </div>
            </div>
        </>
    )
}
