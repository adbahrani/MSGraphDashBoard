import {
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Button,
    Grid,
    CssBaseline,
    Typography,
    TextField,
    FormControlLabel,
} from '@mui/material'
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { SyntheticEvent, useEffect, useState } from 'react'
import { AuthService } from '../services/auth'
import useSnackError from '../hooks/useSnackError'
import { useAuthContext } from '../contexts/Auth'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="#">
                M365 Pulse
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

export const Login = () => {
    const [searchParams] = useSearchParams()
    const location = useLocation()
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
            navigate(location.state?.from ?? '/')
        } catch (e: unknown) {
            setErrorMessage((e as Error).message || 'Unknown error')
        }
    }

    useEffect(() => {
        const hasRedirectError = searchParams.get('redirectError')
        if (hasRedirectError) {
            setErrorMessage('You must login to access the requested page')
        }
    }, [])

    return (
        <Container component="main" maxWidth="xs">
            <SnackErrorComponent />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgColor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleOnChangeEmail}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        onChange={handleOnChangePassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                {"Don't have an account?"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    )
}
