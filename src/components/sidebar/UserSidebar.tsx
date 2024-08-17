import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Typography, Box } from '@mui/material';
import { useUser } from '../../context/UserContext';

interface UserSidebarProps {
  open: boolean;
  onClose: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ open, onClose }) => {
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    onClose(); // Close the sidebar after logout
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 250, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          User Profile
        </Typography>
        <Divider />
        <Box sx={{ my: 2 }}>
          <Typography variant="body1"><strong>Username:</strong> {user?.username}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}><strong>Email:</strong> user@example.com</Typography>
        </Box>
        <Divider />
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default UserSidebar;
