import { NavLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { Button } from '@mui/material'

const HeaderLink = ({ to, inactiveClassName, activeClassName, children, isActive, isButton, onClick, ...props }) => (
    <NavLink to={to}>
        {isButton ? (
            <Button onClick={onClick} sx={{ my: 0, mx: 1.5 }} variant="contained">
                {children}
            </Button>
        ) : (
            <Link
                {...props}
                component="span"
                onClick={onClick}
                className={isActive ? activeClassName : inactiveClassName}
            >
                {children}
            </Link>
        )}
    </NavLink>
)

export default HeaderLink
