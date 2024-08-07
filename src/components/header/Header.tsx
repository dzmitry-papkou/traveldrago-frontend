import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <Link
                    href="/"
                    color="inherit"
                    style={{
                        margin: 8,
                        textDecoration: 'none',
                    }}
                >
                    Home
                </Link>
                <Link
                    href="#about"
                    color="inherit"
                    style={{
                        margin: 8,
                        textDecoration: 'none',
                    }}
                >
                    About
                </Link>
                <Link
                    href="#aboutus"
                    color="inherit"
                    style={{
                        margin: 8,
                        textDecoration: 'none',
                    }}
                >
                    About us
                </Link>
                <Link
                    href="/gallery"
                    color="inherit"
                    style={{
                        margin: 8,
                        textDecoration: 'none',
                    }}
                >
                    Contacts
                </Link>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
