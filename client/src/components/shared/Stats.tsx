import { PropsWithChildren } from 'react'
import Box from '@mui/material/Box'
import { Block } from './Block'
import { camelCaseToWords } from '../../utils/helpers'

interface StatsProps {
    stats: { [key: string]: number | string }
    width?: string
    numberOfColumns?: number
}

export const Stats = ({ stats, width = '100%', numberOfColumns = 5 }: PropsWithChildren<StatsProps>) => {
    return (
        <Box
            component="div"
            sx={{ display: 'grid', width, gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`, gap: '1rem' }}
        >
            {Object.entries(stats).map(([label, value]) => (
                <Block title={camelCaseToWords(label)} key={label}>
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
