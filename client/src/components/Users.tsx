import { useEffect, useState } from 'react'
import { Stats } from './shared/Stats'
import { UsersList } from './UsersList'
import { User, UsersService } from '../services/users'
import { UsersPie } from './UsersPie'

export const Users = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [deletedUsersCount, setDeletedUsersCount] = useState(0);

  useEffect(() => {
    UsersService.getAll().then(users => {
        setUsers(users);
    });
    UsersService.getDeletedUsersCount().then(setDeletedUsersCount)
  }, []);


  return (
    <>
      <Stats users={users} deletedUsersCount={deletedUsersCount} />
      <div style={{display: 'grid', gridTemplateColumns: '60% 40%', height: '40vh'}}>
        <div style={{display: 'grid', gridTemplateColumns: '50% 50%', height: '40vh'}}>
          <div>
              <UsersPie title="Users per Type" users={users} property='userType' fills={['#8bd4eb', '#808080']} />
          </div>
          <div>
              <UsersPie title="Users per Department" users={users} property='department' fills={['#fb8281', '#5f6b6d', '#4bc5bc', '#dfbfbf', '#3699b8', '#8bd4eb', '#5f6b6d', '#5f6b6d', '#fd625e', '#374649']} />
          </div>
          <div>
              <UsersPie title="Users per Usage Location" users={users} property='usageLocation' fills={['#8bd4eb', '#808080']} />
          </div>
          <div>
              <UsersPie title="Users per State" users={users} property='state' fills={['#fb8281', '#5f6b6d', '#4bc5bc', '#dfbfbf', '#3699b8', '#8bd4eb', '#5f6b6d', '#5f6b6d', '#fd625e', '#374649']} />
          </div>
        </div>
        <UsersList users={users}/>
      </div>
    </>
  );
};
