import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/Auth'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login')
        }
    }, [isLoggedIn])

    if (isLoggedIn === null) {
        return <h1>Checking Authorization....</h1>
    }

    if (isLoggedIn === true) {
        return children
    }
}
