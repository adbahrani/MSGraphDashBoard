import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { MenuLink } from '../types/general'
import { TokenService } from '../services/token'
import { AuthService } from '../services/auth'
import { useAuthContext } from '../contexts/Auth'

const linkStyle = { color: '#343434', textDecoration: 'none' }
const activeLinkStyle = { ...linkStyle, backgroundColor: '#eee', borderRadius: '15px', padding: '10px' }
const isSignedIn = () => !!TokenService.getToken()

let links: MenuLink[] = [
    { title: 'Home', to: '/', activeSet: new Set(['/']) },
    { title: 'About', to: '/#about', activeSet: new Set(['/#about']) },
    { title: 'Admin', to: '/admin', activeSet: new Set(['/admin']) },
    {
        title: 'Data Analytics',
        to: '#',
        children: [
            { title: 'Users', to: '/users', activeSet: new Set(['/users']) },
            { title: 'Groups', to: '/groups', activeSet: new Set(['/groups', '/group']) },
            { title: 'Teams', to: '/teams', activeSet: new Set(['/teams']) },
            { title: 'SharePoint', to: '/sharepoint', activeSet: new Set(['/sharepoint']) },
            { title: 'OneDrive', to: '/onedrive', activeSet: new Set(['/onedrive']) },
            { title: 'Reports', to: '/reports', activeSet: new Set(['/reports']) },
        ],
    },
    { title: 'Contact', to: '/#contact', activeSet: new Set(['/#contact']) },
]

export const Menu = () => {
    const location = useLocation()
    const { clearAuthStates } = useAuthContext()
    const navigator = useNavigate()
    const [activeLinks, setActiveLinks] = useState(new Set())
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (link: MenuLink, event: React.MouseEvent<HTMLAnchorElement>) => {
        if (link.title === 'Logout') logout()
        if (link.children) {
            setAnchorEl(event.currentTarget)
        } else {
            handleClose()
        }
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const logout = async () => {
        await AuthService.logout()
        TokenService.clearToken()
        clearAuthStates?.()
        navigator('/')
    }

    useEffect(() => {
        const pathHash = `${location.pathname}${location.hash}`
        const activeLinks = links
            .map(link => {
                if (link.activeSet?.has(pathHash)) {
                    return [link]
                }
                const childMatch = link.children?.find(child => child.activeSet?.has(pathHash))
                if (childMatch) {
                    return [link, childMatch]
                }
                return []
            })
            .flat()
        document.title = `M365 Pulse ${location.pathname.replace('/', '').toLocaleUpperCase()}`
        setActiveLinks(new Set(activeLinks.map(link => link.to)))
        if (!isSignedIn()) {
            links = links.filter(link => link.title !== 'Login' && link.title !== 'Logout')
            links.push({ title: 'Login', to: '/login', activeSet: new Set(['/login']) })
        } else {
            links = links.filter(link => link.title !== 'Login' && link.title !== 'Logout')
            links.push({ title: 'Logout', to: '/', activeSet: new Set(['/']) })
        }
    }, [location])

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: 20,
                padding: 10,
                fontWeight: 600,
                borderRadius: '16px',
                backgroundColor: 'rgba(0,0,0,0.03)',
            }}
        >
            <div style={{ fontSize: '22', marginInline: 1 }}>
                <Link to="/" style={linkStyle}>
                    M365 Pulse
                </Link>
            </div>
            <div>
                <ul
                    style={{
                        listStyleType: 'none',
                        padding: 0,
                        display: 'flex',
                        gap: '16px',
                    }}
                >
                    {links.map(link => (
                        <li key={link.title}>
                            <Link
                                to={link.to}
                                style={
                                    link.title !== 'Logout' && activeLinks.has(link.to) ? activeLinkStyle : linkStyle
                                }
                                onClick={e => handleClick(link, e)}
                            >
                                {link.title}
                            </Link>
                            {link.children ? (
                                <MuiMenu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    {link.children.map(subLink => (
                                        <MenuItem
                                            selected={activeLinks.has(subLink.to)}
                                            component={Link}
                                            to={subLink.to}
                                            style={linkStyle}
                                            onClick={handleClose}
                                            key={subLink.title}
                                        >
                                            {subLink.title}
                                        </MenuItem>
                                    ))}
                                </MuiMenu>
                            ) : null}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
