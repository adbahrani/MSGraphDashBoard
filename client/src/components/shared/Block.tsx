import { PropsWithChildren } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface BlockProps {
    title: string
    titlePosition?: 'center' | 'left'
    onClick?: () => void
}

export const Block = ({ title, titlePosition, onClick, children }: PropsWithChildren<BlockProps>) => {
    return (
        <Box
            component="div"
            sx={{
                m: 1,
                p: 2,
                height: '100%',
                boxSizing: 'border-box',
                border: '1px solid grey',
                flex: 1,
                borderRadius: '8px',
                '&:hover': onClick
                    ? {
                          bgcolor: 'rgba(0,0,0,0.1)',
                          cursor: 'pointer',
                      }
                    : {},
            }}
            onClick={onClick}
        >
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom align={titlePosition || 'left'}>
                {title}
            </Typography>
            {children}
        </Box>
    )
}
