import { useEffect, useState } from 'react'
import { Stats } from '../components/shared/Stats'
import { UsersList } from '../components/UsersList'
import { User, UsersService } from '../services/users'
import { PieData } from '../components/shared/PieData'

export const Users = () => {
    const [users, setUsers] = useState<Array<User>>([])
    const [stats, setStats] = useState({
        users: 0,
        internal: 0,
        guests: 0,
        licensed: 0,
        deactivated: 0,
        deleted: 0,
    })

    useEffect(() => {
        UsersService.getAll().then(users => {
            const newStats = {
                users: users.length,
                internal: 0,
                guests: 0,
                licensed: 0,
                deactivated: 0,
            }

            for (const user of users) {
                if (user.userType === 'Member') {
                    newStats.internal++
                } else {
                    newStats.guests++
                }
                if (user.assignedLicenses.length > 0) {
                    newStats.licensed++
                }
                if (!user.accountEnabled) {
                    newStats.deactivated++
                }
            }
            setStats(currStats => ({ ...currStats, ...newStats }))
            setUsers(users)
        })
        UsersService.getDeletedUsersCount().then(deletedUsersCount => {
            setStats(currStats => ({ ...currStats, deleted: deletedUsersCount }))
        })
    }, [])

    return (
        <>
            <div style={{}}>
                <Stats stats={stats} />
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '60% 40%',
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '50% 50%',
                        }}
                    >
                        <div>
                            <PieData
                                title="Users per Type"
                                data={users}
                                property="userType"
                                fills={['#8bd4eb', '#808080']}
                            />
                        </div>
                        <div>
                            <PieData
                                title="Users per Department"
                                data={users}
                                property="department"
                                fills={[
                                    '#fb8281',
                                    '#5f6b6d',
                                    '#4bc5bc',
                                    '#dfbfbf',
                                    '#3699b8',
                                    '#8bd4eb',
                                    '#5f6b6d',
                                    '#5f6b6d',
                                    '#fd625e',
                                    '#374649',
                                ]}
                            />
                        </div>
                        <div>
                            <PieData
                                title="Users per Usage Location"
                                data={users}
                                property="usageLocation"
                                fills={['#8bd4eb', '#808080']}
                            />
                        </div>
                        <div>
                            <PieData
                                title="Users per State"
                                data={users}
                                property="state"
                                fills={[
                                    '#fb8281',
                                    '#5f6b6d',
                                    '#4bc5bc',
                                    '#dfbfbf',
                                    '#3699b8',
                                    '#8bd4eb',
                                    '#5f6b6d',
                                    '#5f6b6d',
                                    '#fd625e',
                                    '#374649',
                                ]}
                            />
                        </div>
                    </div>
                    <UsersList users={users} />
                </div>
            </div>
        </>
    )
}
