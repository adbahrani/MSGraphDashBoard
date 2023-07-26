import { useEffect, useState } from 'react'
import { Block } from './shared/Block'
import { Pie } from './shared/Pie'
import { User } from '../services/users'

interface UsersPieProps {
    title: string;
    users: Array<User>
    property: 'department' | 'state' | 'userType' | 'usageLocation';
    fills?: string[],
}
export const UsersPie = ({title, property, users, fills}: UsersPieProps) => {
  const [usersPerProperty, setUsersPerProperty] = useState<Array<{label: string, value: number}>>([]);

  useEffect(() => {
    setUsersPerProperty(Object.entries(countUsersByProperty(users, property)).map(([label, value]) => ({label, value})));
  }, [users, property]);

  function countUsersByProperty(users: Array<User>, property: UsersPieProps['property']) {
    const countByProperty: {[propValue: string]: number} = {};
    for (const user of users) {
      const propValue = user[property] || 'Blank';
      if (!countByProperty[propValue]) {
        countByProperty[propValue] = 0;
      }
      countByProperty[propValue]++;
    }

    return countByProperty;
  }


  return (
    <Block title={title}>
        <Pie data={usersPerProperty} fills={fills} />
    </Block>
  );
};
