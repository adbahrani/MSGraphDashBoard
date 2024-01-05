import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'

import { Users } from './views/Users'
import { Landing } from './views/Landing'
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

export default function App() {
    return (
        <AuthContextProvider>
            <CssBaseline />
            <Router>
                <Menu />
                <Container maxWidth="xl">
                    <Routes>
                        <Route path="/" element={<Landing />} />
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
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Routes>
                </Container>
            </Router>
        </AuthContextProvider>
    )
}
