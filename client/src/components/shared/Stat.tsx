import { Box, Typography } from '@mui/material'
import { Block } from './Block'

interface StatProps {
    title: string
    value: number | string
    additionalStyles?: any
}

export const Stat = ({ title, value, additionalStyles }: StatProps) => {
    return (
        <Block title={title} key={title} additionalStyles={{ ...additionalStyles }}>
            <Box
                component="span"
                sx={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                }}
            >
                <Box
                    component="span"
                    sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 22,
                            fontWeight: 700,
                            textTransform: 'capitalize',
                            minHeight: '60px',
                            paddingTop: '15px',
                        }}
                        color="text.secondary"
                        gutterBottom
                        align={'center'}
                    >
                        {value}
                    </Typography>
                </Box>
            </Box>
        </Block>
    )
}