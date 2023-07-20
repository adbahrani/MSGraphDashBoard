import { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import { Block } from './Block';

interface StatsProps  {
    stats: Array<{label:string, value: number}>;
}

export const Stats = ({stats}: PropsWithChildren<StatsProps>) => {

  return (
    <Box component="div" sx={{ display: 'flex', gap: '8px' }}>
        {stats.map(stat => (
            <Block title={stat.label} key={stat.label}>
                <Box component="span" sx={{ display: 'flex', flex: 1, justifyContent: 'center', fontSize: 16, fontWeight: 'bold' }}>
                    {stat.value}
                </Box>
            </Block>
        ))}
    </Box>
    );
};