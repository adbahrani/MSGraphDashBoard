import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const linkStyle = { color: '#343434', textDecoration: 'none' }
const activeLinkStyle = { ...linkStyle, backgroundColor: '#eee', borderRadius: '15px', padding: '10px' }
const links = [
    { title: 'Home', to: '/', activeSet: new Set(['/']) },
    { title: 'About', to: '/#about', activeSet: new Set(['/#about']) },
    { title: 'Services', to: '/#services', activeSet: new Set(['/#services']) },
    { title: 'Contact', to: '/#contact', activeSet: new Set(['/#contact']) },
    { title: 'Users', to: '/users', activeSet: new Set(['/users']) },
    { title: 'Groups', to: '/groups', activeSet: new Set(['/groups', '/group']) },
    { title: 'Teams', to: '/teams', activeSet: new Set(['/teams']) },
    { title: 'SharePoint', to: '/sharepoint', activeSet: new Set(['/sharepoint']) },
    { title: 'OneDrive', to: '/onedrive', activeSet: new Set(['/onedrive']) },
    { title: 'Reports', to: '/reports', activeSet: new Set(['/reports']) },
]

export const Menu = () => {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState('');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState('');
    const isLinkAnchor = (linkTo: string) => linkTo === '/' || linkTo.startsWith('/#');
    
    const handleChange = (event: SelectChangeEvent) => {
        setCurrentPage(event.target.value);
        navigate(event.target.value);
    }
    const clearDropdown = () => setCurrentPage('');

    useEffect(() => {
        const pathHash = `${location.pathname}${location.hash}`
        setActiveLink(links.find(link => link.activeSet.has(pathHash))?.to || '')
        
        if (!isLinkAnchor(pathHash)) {
            setCurrentPage(links.find(link => link.activeSet.has(pathHash))?.to || '');
        }
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
                    <Link to="/" style={linkStyle} onClick={clearDropdown}>
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
                        {links.filter(link => isLinkAnchor(link.to)).map(link => (
                            <li key={link.title}>
                                <Link to={link.to} style={activeLink === link.to ? activeLinkStyle : linkStyle } onClick={clearDropdown}>
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                        <FormControl sx={{minWidth: 150, maxHeight: 0, marginTop: -.85}} size="small">
                            <InputLabel id="dropdown-link-select- label">Data Analytics</InputLabel>
                            <Select 
                                labelId="dropdown-link-select-label"
                                id="dropdown-link-select"
                                value={currentPage}
                                label="MyData"
                                onChange={handleChange}
                                sx={{boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 }, "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                { border: 0 }, "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                { border: 0 }}}
                            >
                                {links.filter(link => !isLinkAnchor(link.to)).map(link => (
                                    <MenuItem value={link.to}>{link.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ul>
                </div>
            </div>
        </>
    )
}
