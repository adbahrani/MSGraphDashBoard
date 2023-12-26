import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToSection } from '../utils/scroll'
import { Box, Typography, Grid } from '@mui/material'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'

export const Landing = () => {
    const { hash } = useLocation()

    useEffect(() => {
        scrollToSection(hash?.replace('#', ''))
    }, [hash])

    return (
        <div>
            <main>
                <section style={{ padding: 20 }}>
                    <Container>
                        <Grid container spacing={6} alignItems="center">
                            <Grid item xs={12} lg={6}>
                                <Box>
                                    <Typography variant="h2">
                                        Empower Your Business with MS365 Pulse Platform
                                    </Typography>
                                    <Typography>
                                        Harness the power of MS Graph API and MS 365 data to drive innovation and
                                        productivity in your organization.
                                    </Typography>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 16,
                                            marginTop: 24,
                                        }}
                                    >
                                        <Button variant="contained" color="primary">
                                            Get Started
                                        </Button>
                                        <Button variant="outlined" color="primary">
                                            Learn More
                                        </Button>
                                    </div>
                                </Box>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <img src="/18383.jpg" alt="Hero" width="100%" />
                            </Grid>
                        </Grid>
                    </Container>
                </section>
            </main>
            <section
                style={{
                    width: '100%',
                    paddingTop: 20,
                    // '@media (min-width: 768px)': { paddingTop: '96px' },
                    // '@media (min-width: 1024px)': { paddingTop: '128px' },
                    backgroundColor: '#f3f4f6',
                }}
            >
                <Container maxWidth="xl" sx={{ p: 2 }}>
                    <div style={{ textAlign: 'center' }}>
                        <Typography
                            variant="h3"
                            gutterBottom
                            fontWeight="bold"
                            style={{ marginBottom: '16px', fontSize: '1.875rem', lineHeight: '2.5rem' }}
                        >
                            Simplify Your Workflow
                        </Typography>
                        <Typography variant="h4" paragraph color="textSecondary">
                            Our platform provides a seamless integration with MS Graph API and MS 365 data, enabling you
                            to focus on what matters - building great applications.
                        </Typography>
                    </div>
                    <Grid container alignItems="center" spacing={6} justifyContent="center">
                        <Grid item xs={12} lg={6}>
                            <img
                                alt="Image"
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: '0.75rem',
                                    width: '100%',
                                    order: '2',
                                }}
                                src="/workFlow.jpg"
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            lg={6}
                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', order: '1' }}
                        >
                            <ul style={{ listStyle: 'none', padding: '0' }}>
                                <li style={{ marginBottom: '32px' }}>
                                    <div>
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
                                        >
                                            Easy Integration
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="textSecondary"
                                            style={{ fontSize: '1rem', lineHeight: '1.75rem', color: '#6b7280' }}
                                        >
                                            Integrate MS Graph API and MS 365 data with ease.
                                        </Typography>
                                    </div>
                                </li>
                                <li style={{ marginBottom: '32px' }}>
                                    <div>
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
                                        >
                                            Automation
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="textSecondary"
                                            style={{ fontSize: '1rem', lineHeight: '1.75rem', color: '#6b7280' }}
                                        >
                                            Automate your workflow with our platform.
                                        </Typography>
                                    </div>
                                </li>
                                <li style={{ marginBottom: '32px' }}>
                                    <div>
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
                                        >
                                            Scalability
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="textSecondary"
                                            style={{ fontSize: '1rem', lineHeight: '1.75rem', color: '#6b7280' }}
                                        >
                                            Scale your application with ease.
                                        </Typography>
                                    </div>
                                </li>
                            </ul>
                        </Grid>
                    </Grid>
                </Container>
            </section>

            <footer
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '16px 24px',
                    borderTop: '1px solid #ccc',
                    color: '#666',
                }}
            >
                <Typography variant="body2" style={{ alignSelf: 'flex-start' }}>
                    © MS365 Pulse. All rights reserved.
                </Typography>
                <nav style={{ alignSelf: 'flex-end' }}>
                    <span>Terms of Service | Privacy</span>
                </nav>
            </footer>
        </div>
    )
}
