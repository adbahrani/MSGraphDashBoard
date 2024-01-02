import {
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Button,
    createTheme,
    ThemeProvider,
    Grid,
    Snackbar,
    Alert,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AuthService } from '../services/auth'
import useSnackError from '../hooks/useSnackError'

export const Login = () => {
    const theme = createTheme({
        spacing: 14,
    })
    const { setErrorMessage, SnackErrorComponent } = useSnackError()
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword(show => !show)
    const [password, setPassword] = useState('')
    const handleOnChangePassword = (event: any) => {
        setPassword(event.target.value)
    }
    const [email, setEmail] = useState('')
    const handleOnChangeEmail = (event: any) => {
        setEmail(event.target.value)
    }
    const navigate = useNavigate()
    const handleLogin = async () => {
        if (!email || !password) {
            return
        }
        localStorage.setItem('email', email)
        localStorage.setItem('password', password)
        try {
            await AuthService.login({ email, password })
            navigate('/')
        } catch (e: any) {
            setErrorMessage(e.message || 'Unknown error')
        }
    }



    return (
        <ThemeProvider theme={theme}>
            <SnackErrorComponent />
            <div
                id="home"
                style={{
                    height: '100vh',
                    backgroundColor: 'lightgrey',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <h1>Login</h1>
                <div>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <OutlinedInput id="email" type={'text'} label="Email" onChange={handleOnChangeEmail} />
                    </FormControl>
                </div>
                <Grid item>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            onChange={handleOnChangePassword}
                        />
                        <Button sx={{ mt: '1rem' }} variant="contained" onClick={handleLogin} color="success">
                            Submit
                        </Button>
                    </FormControl>


                    <Grid item >
                        <Link to="/signup">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </div>
        </ThemeProvider>
    )
}
