import { Link } from 'react-router-dom'

const linkStyle = { color: '#343434', textDecoration: 'none' }
const links = [
    { title: 'Home', to: '/' },
    { title: 'About', to: '/#about' },
    { title: 'Services', to: '/#services' },
    { title: 'Users', to: '/users' },
    { title: 'Groups', to: '/groups' },
    { title: 'Contact', to: '/#contact' },
]

export const Menu = () => {
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
                        LOGO
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
                                <Link to={link.to} style={linkStyle}>
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
