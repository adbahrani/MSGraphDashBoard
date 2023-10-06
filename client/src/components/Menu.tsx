import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const linkStyle = { color: '#343434', textDecoration: 'none' }
const activeLinkStyle = { ...linkStyle, backgroundColor: '#eee', borderRadius: '15px', padding: '10px' }
const links = [
    { title: 'Home', to: '/', activeSet: new Set(['/']) },
    { title: 'About', to: '/#about', activeSet: new Set(['/#about']) },
    { title: 'Services', to: '/#services', activeSet: new Set(['/#services']) },
    { title: 'Users', to: '/users', activeSet: new Set(['/users']) },
    { title: 'Groups', to: '/groups', activeSet: new Set(['/groups', '/group']) },
    { title: 'Teams', to: '/teams', activeSet: new Set(['/teams']) },
    { title: 'SharePoint', to: '/sharepoint', activeSet: new Set(['/sharepoint']) },
    { title: 'Reports', to: '/reports', activeSet: new Set(['/reports']) },
    { title: 'Contact', to: '/#contact', activeSet: new Set(['/#contact']) },
]

export const Menu = () => {
    const location = useLocation()
    const [activeLink, setActiveLink] = useState('')

    useEffect(() => {
        const pathHash = `${location.pathname}${location.hash}`
        setActiveLink(links.find(link => link.activeSet.has(pathHash))?.to || '')
    }, [location])

    return (
        <>
            <div
                style={{
                    height: '60px',
                    width: 'calc(90vw - 64px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '10px 5vw',
                    padding: '0 32px',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '16px',
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    position: 'absolute',
                }}
            >
                <div style={{ fontSize: '22px' }}>
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
                                <Link to={link.to} style={activeLink === link.to ? activeLinkStyle : linkStyle}>
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}
