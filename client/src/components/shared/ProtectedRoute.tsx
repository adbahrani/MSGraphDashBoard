import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/Auth'
import { useEffect } from 'react'
import { Box } from '@mui/material'

export default function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuthContext()
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login?redirectError=true', { state: { from: location.pathname } })
        }
    }, [isLoggedIn])

    if (isLoggedIn === null) {
        return (
            <Box
                fontStyle={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '85px',
                }}
            >
                <h1 style={{ color: '#999' }}>Checking Authorization....</h1>
            </Box>
        )
    }

    if (isLoggedIn === true) {
        return children
    }
}
