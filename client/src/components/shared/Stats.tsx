import { PropsWithChildren } from 'react'
import Box from '@mui/material/Box'
import { Stat } from './Stat'

interface StatsProps {
    stats: { [key: string]: number | string }
    width?: string
    numberOfColumns?: number
}

const windowWidth = window.innerWidth

const getContainerStyle: any = numberOfColumns => {
    switch (numberOfColumns) {
        case 4:
            if (windowWidth < 800) {
                return { gridTemplateColumns: `repeat(2, 1fr)` }
            }
            return { gridTemplateColumns: `repeat(4, 1fr)` }
        case 5:
            if (windowWidth < 800) {
                return {
                    gridTemplateRows: 'auto auto auto' /* Adjust the height as needed */,
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridTemplateAreas: `'ga0 ga1 ga2 ga3'
                      'ga4 ga5 ga6 ga7'
                      'ga8 ga9 . .'`,
                }
            }
            return { gridTemplateColumns: `repeat(5, 1fr)` }
        case 6:
            if (windowWidth < 800) {
                return `repeat(3, 1fr)`
            }
            return { gridTemplateColumns: `repeat(6, 1fr)` }
        default:
            return { gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)` }
    }
}

const getBlockStyle: any = (numberOfColumns, index: number) => {
    switch (numberOfColumns) {
        case 5:
            if (windowWidth < 800 && index >= 8) {
                if (index >= 8) {
                    return {
                        gridArea: 'ga' + index,
                        gridColumn: 'span 2',
                    }
                } else {
                    return {
                        gridArea: 'ga' + index,
                    }
                }
            }
            break
        default:
            break
    }
    return {}
}

export const Stats = ({ stats, width = '100%', numberOfColumns = 5 }: PropsWithChildren<StatsProps>) => {
    return (
        <Box component="div" sx={{ display: 'grid', width, ...getContainerStyle(numberOfColumns) }}>
            {Object.entries(stats).map(([label, value], index) => (
                <Stat
                    title={label}
                    key={label}
                    additionalStyles={{ ...getBlockStyle(numberOfColumns, index) }}
                    value={value}
                />
            ))}
        </Box>
    )
}
