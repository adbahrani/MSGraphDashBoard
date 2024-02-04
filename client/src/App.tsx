import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Users } from './views/Users'
import Landing from './views/Landing'
import { Groups } from './views/Groups'
import { GroupDetails } from './views/GroupDetails'
import { Reports } from './views/Reports'
import { Teams } from './views/Teams'
import { SharePoint } from './views/SharePoint'
import { OneDrive } from './views/OneDrive'
import { Login } from './views/Login'
import { Menu } from './components/Menu'
import Container from '@mui/material/Container'
import Admin from './views/Admin'
import SignUp from './views/Signup'
import { AuthContextProvider } from './contexts/Auth'
import ProtectedRoute from './components/shared/ProtectedRoute'
import { CssBaseline } from '@mui/material'
import { Exchange } from './views/Exchange'
import Header from './components/Header'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import GlobalStyles from '@mui/material/GlobalStyles'
import theme from './theme/theme'
import Contact from './views/Contact'
import About from './views/About'

const defaultTheme = createTheme(theme)

export default function App() {
    return (
        <AuthContextProvider>
            <ThemeProvider theme={defaultTheme}>
                <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
                <CssBaseline />
                <Router>
                    <Header />
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/about" element={<About />} />
                            <Route
                                path="/users"
                                element={
                                    <ProtectedRoute>
                                        <Users />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute>
                                        <Admin />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/groups"
                                element={
                                    <ProtectedRoute>
                                        <Groups />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/group"
                                element={
                                    <ProtectedRoute>
                                        <GroupDetails />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/teams"
                                element={
                                    <ProtectedRoute>
                                        <Teams />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/sharepoint"
                                element={
                                    <ProtectedRoute>
                                        <SharePoint />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/reports"
                                element={
                                    <ProtectedRoute>
                                        <Reports />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/onedrive"
                                element={
                                    <ProtectedRoute>
                                        <OneDrive />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/exchange"
                                element={
                                    <ProtectedRoute>
                                        <Exchange />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                        </Routes>
                    </div>
                </Router>
            </ThemeProvider>
        </AuthContextProvider>
    )
}
