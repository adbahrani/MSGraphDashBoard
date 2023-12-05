import { Skeleton } from "@mui/material"


export const BoxLoader = ({ width = "100%", numberOfBoxes, boxWidth, boxHeight }: {
    width?: string,
    numberOfBoxes: number,
    boxWidth: string,
    boxHeight: string
}) => {
    return <div style={{
        display: 'flex',
        width,
        gap: '1rem',
        flexWrap: 'wrap'
    }}>{[...Array(numberOfBoxes)].map((_, index) => (<Skeleton key={index} width={boxWidth} height={boxHeight} animation="wave" variant="rectangular" />))}
    </div>
}