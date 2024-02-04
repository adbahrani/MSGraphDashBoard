import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import HeaderLink from './HeaderLink'
import Logo from '../assets/logo.png'
import React, { useState, useEffect, useCallback } from 'react'
import { smBreakPoint } from '../helpers/UIHelpers'
import MuiMenu from '@mui/material/Menu'
import { MenuItem, SwipeableDrawer } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MenuLink } from '../types/general'
import { TokenService } from '../services/token'
import { AuthService } from '../services/auth'
import { useAuthContext } from '../contexts/Auth'
import MenuIcon from '@mui/icons-material/Menu'
import './Header.css'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const links: MenuLink[] = [
    { title: 'Home', to: '/', activeSet: new Set(['/']) },
    { title: 'About', to: '/about', activeSet: new Set(['/about']) },
    { title: 'Admin', to: '/admin', activeSet: new Set(['/admin']), secure: true },
    {
        title: 'Data Analytics',
        to: '#',
        secure: true,
        children: [
            { title: 'Users', to: '/users', activeSet: new Set(['/users']) },
            { title: 'Groups', to: '/groups', activeSet: new Set(['/groups', '/group']) },
            { title: 'Teams', to: '/teams', activeSet: new Set(['/teams']) },
            { title: 'SharePoint', to: '/sharepoint', activeSet: new Set(['/sharepoint']) },
            { title: 'OneDrive', to: '/onedrive', activeSet: new Set(['/onedrive']) },
            { title: 'Reports', to: '/reports', activeSet: new Set(['/reports']) },
            { title: 'Exchange', to: '/exchange', activeSet: new Set(['/exchange']) },
        ],
    },
    { title: 'Contact', to: '/contact', activeSet: new Set(['/contact']) },
    { title: 'Login', to: '/login', activeSet: new Set(['/login']), isButton: true },
    { title: 'Logout', to: '/', activeSet: new Set(['/']), secure: true, isButton: true },
]

function Header() {
    const location = useLocation()
    const [scrolledDown, setScrolledDown] = useState(false)
    const { isLoggedIn } = useAuthContext()
    const [activeLinks, setActiveLinks] = useState(new Set())
    const [drawer, setDrawer] = useState(false)
    const { clearAuthStates } = useAuthContext()
    const navigator = useNavigate()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (link: MenuLink, event: React.MouseEvent<HTMLAnchorElement>) => {
        if (link.title === 'Logout') logout()
        if (link.children) {
            setAnchorEl(anchorEl ? null : event.currentTarget)
        } else {
            handleClose()
        }
    }
    const handleClose = () => {
        setAnchorEl(null)
        setDrawer(false)
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolledDown(window.scrollY > 40)
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

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
    }, [location])

    const logout = async () => {
        await AuthService.logout()
        TokenService.clearToken()
        clearAuthStates?.()
        navigator('/')
    }

    const shouldSkipAdding = useCallback(
        link => (link.secure && !isLoggedIn) || (link.title === 'Login' && isLoggedIn),
        [isLoggedIn]
    )

    const renderNavigation = () => {
        if (window.innerWidth < smBreakPoint) {
            return (
                <>
                    <Button href="#" sx={{ mr: -2, height: '50px', width: '50px' }} onClick={() => setDrawer(true)}>
                        <MenuIcon />
                    </Button>
                    <SwipeableDrawer
                        anchor="right"
                        open={drawer}
                        onClose={() => setDrawer(false)}
                        onOpen={() => setDrawer(true)}
                    >
                        <div className="drawer">
                            <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                                <img
                                    alt=""
                                    src={Logo}
                                    style={{ height: '40px', marginTop: '20px', marginBottom: '40px' }}
                                />
                            </Typography>
                            <ul>
                                {links.map((link, index) => {
                                    if (shouldSkipAdding(link)) return null
                                    return (
                                        <li key={index}>
                                            <HeaderLink
                                                variant="button"
                                                color="text.primary"
                                                isButton={link.isButton}
                                                to={link.to}
                                                activeClassName="headerLinkActive"
                                                inactiveClassName="headerLink"
                                                onClick={e => handleClick(link, e)}
                                                isActive={link.title !== 'Logout' && activeLinks.has(link.to)}
                                            >
                                                <div className="HeadLinkIcon">
                                                    {link.children ? (
                                                        <ChevronRightIcon
                                                            style={{ transform: `rotate(${open ? '90deg' : '0deg'})` }}
                                                        />
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                                {link.title}
                                            </HeaderLink>
                                            {link.children && open ? (
                                                <div className="sub-links">
                                                    {link.children.map(subLink => (
                                                        <HeaderLink
                                                            variant="button"
                                                            color="text.primary"
                                                            isButton={subLink.isButton}
                                                            selected={activeLinks.has(subLink.to)}
                                                            to={subLink.to}
                                                            activeClassName="headerLinkActive"
                                                            inactiveClassName="headerLink"
                                                            onClick={handleClose}
                                                            key={subLink.title}
                                                            isActive={activeLinks.has(subLink.to)}
                                                        >
                                                            {subLink.title}
                                                        </HeaderLink>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </SwipeableDrawer>
                </>
            )
        }
        return (
            <>
                <nav>
                    <ul style={{ listStyleType: 'none', display: 'flex' }}>
                        {links.map((link, index) => {
                            if (shouldSkipAdding(link)) return null
                            return (
                                <li key={index}>
                                    <HeaderLink
                                        variant="button"
                                        color="text.primary"
                                        isButton={link.isButton}
                                        to={link.to}
                                        activeClassName="headerLinkActive"
                                        inactiveClassName="headerLink"
                                        sx={{ mx: '0.4rem' }}
                                        onClick={e => handleClick(link, e)}
                                        isActive={link.title !== 'Logout' && activeLinks.has(link.to)}
                                    >
                                        {link.title}
                                    </HeaderLink>
                                    {link.children ? (
                                        <MuiMenu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            className="headerMenu"
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
                                                    className="headerMenuItem"
                                                    onClick={handleClose}
                                                    key={subLink.title}
                                                    sx={{ py: 1.2, fontSize: '14px' }}
                                                >
                                                    {subLink.title}
                                                </MenuItem>
                                            ))}
                                        </MuiMenu>
                                    ) : null}
                                </li>
                            )
                        })}
                    </ul>
                </nav>
                {/* <Button href="#" variant="contained" sx={{ my: 1, mx: 1.5 }}>
                    Login
                </Button> */}
            </>
        )
    }

    return (
        <div className="Header">
            <AppBar
                position="fixed"
                color="default"
                elevation={0}
                sx={{ background: '#fff', py: 1, boxShadow: scrolledDown ? '0 0 2px rgba(0,0,0,0.2)' : '' }}
            >
                <Toolbar sx={{ flexWrap: 'wrap' }}>
                    <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        <img alt="" src={Logo} style={{ height: '40px', marginTop: '20px' }} />
                    </Typography>
                    {renderNavigation()}
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header
