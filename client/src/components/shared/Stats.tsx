import { PropsWithChildren, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { Block } from './Block'
import { User } from '../../services/users'

interface StatsProps {
    users: Array<User>
    deletedUsersCount: number
}

export const Stats = ({ users, deletedUsersCount }: PropsWithChildren<StatsProps>) => {
    const [stats, setStats] = useState({
        users: 0,
        internal: 0,
        guests: 0,
        licensed: 0,
        deactivated: 0,
        deleted: 0,
    })

    useEffect(() => {
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
        setStats({ ...stats, ...newStats })
    }, [users])

    useEffect(() => {
        setStats({ ...stats, deleted: deletedUsersCount })
    }, [deletedUsersCount])

    return (
        <Box component="div" sx={{ display: 'flex', gap: '8px' }}>
            {Object.entries(stats).map(([label, value]) => (
                <Block title={label} key={label}>
                    <Box
                        component="span"
                        sx={{ display: 'flex', flex: 1, justifyContent: 'center', fontSize: 16, fontWeight: 'bold' }}
                    >
                        {value}
                    </Box>
                </Block>
            ))}
        </Box>
    )
}
