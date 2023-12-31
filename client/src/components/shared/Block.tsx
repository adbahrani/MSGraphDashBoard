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
        <>
            {title && (
                <Box
                    component="div"
                    sx={{
                        m: 1,
                        p: 2,
                        border: '0.5px solid grey',
                        flex: 1,
                        borderRadius: 2,
                        boxShadow: 3,
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
                    <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                        align={titlePosition || 'left'}
                    >
                        {title}
                    </Typography>
                    {children}
                </Box>
            )}
        </>
    )
}
