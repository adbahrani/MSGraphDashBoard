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
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { SyntheticEvent, useState } from 'react'
import { AuthService } from '../services/auth'
import useSnackError from '../hooks/useSnackError'
import { useAuthContext } from '../contexts/Auth'

export const Login = () => {
    const theme = createTheme({
        spacing: 14,
    })
    const { setAuthStates } = useAuthContext()
    const { setErrorMessage, SnackErrorComponent } = useSnackError()
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword(show => !show)
    const [password, setPassword] = useState('')
    const handleOnChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }
    const [email, setEmail] = useState('')
    const handleOnChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }
    const navigate = useNavigate()
    const handleLogin = async (e: SyntheticEvent) => {
        e.preventDefault()
        try {
            const token = await AuthService.login({ email, password })
            setAuthStates?.(token)
            navigate('/')
        } catch (e: unknown) {
            setErrorMessage((e as Error).message || 'Unknown error')
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <SnackErrorComponent />
            <form
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
                onSubmit={handleLogin}
            >
                <h1>Login</h1>
                <div>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <OutlinedInput required id="email" type={'text'} label="Email" onChange={handleOnChangeEmail} />
                    </FormControl>
                </div>
                <Grid item>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            required
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
                        <Button type="submit" sx={{ mt: '1rem' }} variant="contained" color="success">
                            Submit
                        </Button>
                    </FormControl>

                    <Grid item>
                        <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
                    </Grid>
                </Grid>
            </form>
        </ThemeProvider>
    )
}
