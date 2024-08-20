import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useUser } from '../../context/UserContext';
import UserSidebar from '../sidebar/UserSidebar';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { user } = useUser();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <Link href="/" color="inherit" sx={{ marginRight: '8px', textDecoration: 'none' }}>
                        Home
                    </Link>
                    <Link href="/gallery" color="inherit" sx={{ marginRight: '8px', textDecoration: 'none' }}>
                        Contacts
                    </Link>
                    {user ? (
                        <Typography component="p" sx={{ marginRight: '8px', cursor: 'pointer' }} onClick={handleSidebarToggle}>
                            Welcome, {user.username}
                        </Typography>
                    ) : (
                        <>
                            <Link href="/login" color="inherit" sx={{ marginRight: '8px', textDecoration: 'none' }}>
                                Login
                            </Link>
                            <Link href="/signup" color="inherit" sx={{ marginRight: '8px', textDecoration: 'none' }}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Toolbar /> {/* Padding to ensure content is not hidden under the fixed AppBar */}
            <UserSidebar open={isSidebarOpen} onClose={handleSidebarToggle} />
        </>
    );
};

export default Header;
