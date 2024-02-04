import * as React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import './Contact.css'

import { Box, Button, Container } from '@mui/material'

export default function Contact() {
    return (
        <Box className="ContactContainer">
            <Container maxWidth="md" className="ContactForm">
                <Typography variant="h6" gutterBottom>
                    Contact Us
                </Typography>
                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="cardName"
                                label="Your Name"
                                fullWidth
                                sx={{ my: 1 }}
                                autoComplete="cc-name"
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="cardMail"
                                sx={{ my: 1 }}
                                label="Your email"
                                fullWidth
                                autoComplete="cc-email"
                                variant="standard"
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        id="cardMessage"
                        required
                        label="Message"
                        sx={{ mt: 1, mb: 6 }}
                        multiline
                        fullWidth
                        autoComplete="cc-message"
                        variant="standard"
                    />
                    <Grid item xs={12}>
                        <Button variant="contained">Send</Button>
                    </Grid>
                </Box>
            </Container>
        </Box>
    )
}
