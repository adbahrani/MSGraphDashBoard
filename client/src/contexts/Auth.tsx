import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { TokenService } from '../services/token'

// IsloggedIn can be null or boolean, null means token check has not initiated, to avoid initial redirects while render
type IsLoggedIn = boolean | null

const AuthContext = createContext<{
    isLoggedIn: IsLoggedIn
    token: string
    setAuthStates?: (value: string) => void
    clearAuthStates?: () => void
}>({
    isLoggedIn: null,
    token: '',
})

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<IsLoggedIn>(null)
    const [authToken, setAuthToken] = useState('')

    const setAuthStates = (tokenValue: string) => {
        setAuthToken(tokenValue)
        setIsLoggedIn(!!tokenValue)
    }

    const clearAuthStates = () => {
        setAuthToken('')
        setIsLoggedIn(false)
    }

    useEffect(() => {
        const tokenValue = TokenService.getToken()
        setAuthToken(tokenValue)
        setIsLoggedIn(!!tokenValue)
    }, [])

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                token: authToken,
                setAuthStates,
                clearAuthStates,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)
