import {
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Button,
    createTheme,
    ThemeProvider,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useState, MouseEvent } from 'react'

export const Login = () => {
    const theme = createTheme({
        spacing: 14,
    })
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword(show => !show)
    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }
    const [password, setPassword] = useState('')
    const handleOnChangePassword = (event: any) => {
        setPassword(event.target.value)
    }
    const [email, setEmail] = useState('')
    const handleOnChangeEmail = (event: any) => {
        setEmail(event.target.value)
    }
    const navigate = useNavigate()
    const handleLogin = () => {
        if (!email || !password) {
            return
        }
        localStorage.setItem('email', email)
        localStorage.setItem('password', password)
        navigate('/')
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <div
                    id="home"
                    style={{
                        height: '100vh',
                        backgroundColor: 'lightgreen',
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
                            <OutlinedInput
                                id="email"
                                type={'text'}
                                label="Email"
                                onChange={handleOnChangeEmail.bind(this)}
                            />
                        </FormControl>
                    </div>
                    <div>
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
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                onChange={handleOnChangePassword.bind(this)}
                            />
                        </FormControl>
                        <div>
                            <Button variant="contained" onClick={handleLogin} color="success">
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        </>
    )
}
