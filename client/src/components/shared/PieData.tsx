import { useEffect, useState } from 'react'
import { Block } from './Block'
import { Pie } from './Pie'
import { countByProperty } from '../../utils/aggregate'
import { SxProps, Theme } from '@mui/material'

interface PieDataProps<T extends object> {
    title: string
    data: Array<T>
    property: string
    fills?: string[],
    height?: number,
    additionalBlockStyles?: SxProps<Theme>
}
export function PieData<T extends object>({ title, property, data, fills, height, additionalBlockStyles }: PieDataProps<T>) {
    const [dataPerProperty, setDataPerProperty] = useState<Array<{ label: string; value: number }>>([])

    useEffect(() => {
        setDataPerProperty(
            Object.entries(countByProperty<T>(data, property)).map(([label, value]) => ({ label, value }))
        )
    }, [data, property])

    return (
        <Block additionalStyles={additionalBlockStyles} title={title}>
            <Pie height={height} data={dataPerProperty} fills={fills} />
        </Block>
    )
}
