import { useEffect, useState } from 'react'
import { Block } from './shared/Block'
import { Pie } from './shared/Pie'
import { Stats } from './shared/Stats'
import { UsersList } from './UsersList'
import { UsersService } from '../services/users'

//TODO: use real data, add types
export const Users = () => {
    const stats = [
        { label: 'Users', value: 35 },
        { label: 'Internal', value: 32 },
        { label: 'Guests', value: 3 },
        { label: 'Licensed', value: 21 },
        { label: 'Deactivated', value: 0 },
        { label: 'Deleted', value: 20 },
    ]
    const usersPerType = {
        data: [
            { label: 'Guest', value: 22 },
            { label: 'Member', value: 124 },
        ],
        fills: ['#8bd4eb', '#808080'],
    }
    const usersPerDepartment = {
        data: [
            { label: 'Sales', value: 22 },
            { label: 'Retail', value: 25 },
            { label: 'R&D', value: 30 },
            { label: 'Operations', value: 20 },
            { label: 'Manufacturing', value: 23 },
            { label: 'IT', value: 5 },
            { label: 'HR', value: 4 },
            { label: 'Finance', value: 4 },
            { label: 'Exec', value: 2 },
            { label: '(Blank)', value: 6 },
        ],
        fills: [
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
        ],
    }
    const [users, setUsers] = useState([])

    useEffect(() => {
        UsersService.getAll().then(setUsers)
    }, [])

    return (
        <>
            <Stats stats={stats} />
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '60% 40%',
                    height: '40vh',
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '50% 50%',
                        height: '40vh',
                    }}
                >
                    <div>
                        <Block title="Users per Type">
                            <Pie
                                data={usersPerType.data}
                                fills={usersPerType.fills}
                            />
                        </Block>
                    </div>
                    <div>
                        <Block title="Users per Department">
                            <Pie
                                data={usersPerDepartment.data}
                                fills={usersPerDepartment.fills}
                            />
                        </Block>
                    </div>
                    <div>
                        <Block title="Users per Type">
                            <Pie
                                data={usersPerType.data}
                                fills={usersPerType.fills}
                            />
                        </Block>
                    </div>
                    <div>
                        <Block title="Users per Department">
                            <Pie
                                data={usersPerDepartment.data}
                                fills={usersPerDepartment.fills}
                            />
                        </Block>
                    </div>
                </div>
                <UsersList users={users} />
            </div>
        </>
    )
}
