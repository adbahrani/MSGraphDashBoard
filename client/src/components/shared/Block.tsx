import { PropsWithChildren } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface BlockProps {
    title: string
    titlePosition?: 'center' | 'left'
}

export const Block = ({ title, titlePosition, children }: PropsWithChildren<BlockProps>) => {
    return (
        <Box
            component="div"
            sx={{
                m: 1,
                p: 2,
                border: '1px solid grey',
                flex: 1,
                borderRadius: '8px',
            }}
        >
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom align={titlePosition || 'left'}>
                {title}
            </Typography>
            {children}
        </Box>
    )
}
