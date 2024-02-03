import { PropsWithChildren } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { SxProps, Theme } from '@mui/material'

interface BlockProps {
    title?: string
    titlePosition?: 'center' | 'left'
    onClick?: () => void
    additionalStyles?: SxProps<Theme>
}

export const Block = ({
    title,
    titlePosition,
    onClick,
    children,
    additionalStyles = {},
}: PropsWithChildren<BlockProps>) => {
    return (
        <Box
            component="div"
            sx={{
                m: 1,
                py: 2,
                px: 1,
                flex: 1,
                borderRadius: 2,
                boxShadow: '2px 2px 10px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'space-between',
                '&:hover': onClick
                    ? {
                          bgcolor: 'rgba(0,0,0,0.1)',
                          cursor: 'pointer',
                      }
                    : {},
                ...additionalStyles,
            }}
            onClick={onClick}
        >
            {title && (
                <Typography
                    sx={{ fontSize: 14, fontWeight: 500, px: 1, textTransform: 'capitalize' }}
                    color="text.secondary"
                    gutterBottom
                    align={titlePosition || 'left'}
                >
                    {title}
                </Typography>
            )}
            {children}
        </Box>
    )
}
