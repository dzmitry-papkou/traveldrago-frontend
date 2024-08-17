import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button'; // Import Button from Material-UI
import { useUser } from '../../context/UserContext'; // Adjust path and use useUser for safety

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { user, logout } = useUser(); // Use useUser hook to get user and logout method

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
                    href="/gallery"
                    color="inherit"
                    style={{
                        margin: 8,
                        textDecoration: 'none',
                    }}
                >
                    Contacts
                </Link>
                {user ? (
                    <>
                        <Typography component="p" style={{ margin: 8 }}>
                            Welcome, {user.username}
                        </Typography>
                        <Button
                            onClick={logout} // Use logout function
                            color="inherit"
                            style={{ margin: 8 }}
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            color="inherit"
                            style={{
                                margin: 8,
                                textDecoration: 'none',
                            }}
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            color="inherit"
                            style={{
                                margin: 8,
                                textDecoration: 'none',
                            }}
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
