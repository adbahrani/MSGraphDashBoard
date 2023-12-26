import * as React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

import { Button, Container } from '@mui/material'

export default function PaymentForm() {
    return (
        <Container>
            <Typography variant="h6" gutterBottom>
                Tenant Registration
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="cardName"
                        label="Tenant Name"
                        fullWidth
                        autoComplete="cc-name"
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField id="cardNumber" label="Comments" fullWidth autoComplete="cc-number" variant="standard" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="expDate"
                        label="Client ID"
                        fullWidth
                        autoComplete="cc-exp"
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="cvv"
                        label="Client Secret"
                        // helperText="Last three digits on signature strip"
                        fullWidth
                        type="password"
                        autoComplete="cc-csc"
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained">Save</Button>
                </Grid>
            </Grid>
        </Container>
    )
}
