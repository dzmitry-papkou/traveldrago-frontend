import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, Divider, Typography, Box, Button, ListItemIcon, Dialog, DialogTitle, DialogActions } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import SupportIcon from '@mui/icons-material/Support';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routePaths';
import { useUser } from '../../context/UserContext';

interface UserSidebarProps {
  open: boolean;
  onClose: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ open, onClose }) => {
  const { user, logout, refreshUserData } = useUser();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [hasRefreshed, setHasRefreshed] = useState(false); // State to track if data has been refreshed
  const navigate = useNavigate();

  // Refresh user data when the sidebar opens, but only once per open
  useEffect(() => {
    if (open && !hasRefreshed) {
      refreshUserData().then(() => setHasRefreshed(true));
    }
  }, [open, hasRefreshed, refreshUserData]);

  // Reset the hasRefreshed state when the sidebar is closed
  useEffect(() => {
    if (!open) {
      setHasRefreshed(false);
    }
  }, [open]);

  const handleAccountSettingsClick = () => {
    navigate(ROUTE_PATHS.ACCOUNT_SETTINGS);
    onClose();
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout().then(() => {
      setLogoutDialogOpen(false);
      onClose();
      navigate('/');  // Redirect to home page after logout
    });
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  // Function to navigate to the event creation page
  const handleCreateEventClick = () => {
    navigate(ROUTE_PATHS.CREATE_EVENT);
    onClose();
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
        }}
      >
        <Box
          sx={{
            width: '300px',
            height: '100vh',
            bgcolor: '#3a3a3a',
            color: 'white',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '0 0 0 20px',
            boxSizing: 'border-box',
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              User Profile
            </Typography>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
            <Box sx={{ my: 2 }}>
              <Typography variant="body1">
                <strong>Username:</strong> {user?.username || 'Loading...'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Email:</strong> {user?.email || 'Loading...'}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
            <List>
            <ListItem disablePadding>
              <Button
                variant="contained"
                fullWidth
                startIcon={<FavoriteIcon />} // You can change this icon if you prefer
                sx={{
                  mb: 1,
                  bgcolor: '#5a5a5a',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  padding: '6px 12px',
                  fontSize: '0.875rem',
                  '&:hover': {
                    bgcolor: '#494949',
                  },
                }}
                onClick={() => {
                  navigate(ROUTE_PATHS.YOUR_EVENTS); // Navigate to the 'Your Events' page
                  onClose(); // Close the sidebar
                }}
              >
                Your Events
              </Button>
            </ListItem>

              <ListItem disablePadding>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  sx={{
                    mb: 1,
                    bgcolor: '#5a5a5a',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                    '&:hover': {
                      bgcolor: '#494949',
                    },
                  }}
                  onClick={handleCreateEventClick}
                >
                  Create Event
                </Button>
              </ListItem>

              <ListItem disablePadding>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SettingsIcon />}
                  sx={{
                    mb: 1,
                    bgcolor: '#5a5a5a',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                    '&:hover': {
                      bgcolor: '#494949',
                    },
                  }}
                  onClick={handleAccountSettingsClick}
                >
                  Account Settings
                </Button>
              </ListItem>
              <ListItem disablePadding>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<NotificationsIcon />}
                  sx={{
                    mb: 1,
                    bgcolor: '#5a5a5a',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                    '&:hover': {
                      bgcolor: '#494949',
                    },
                  }}
                >
                  Notifications
                </Button>
              </ListItem>
              <ListItem disablePadding>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SupportIcon />}
                  sx={{
                    mb: 1,
                    bgcolor: '#5a5a5a',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                    '&:hover': {
                      bgcolor: '#494949',
                    },
                  }}
                >
                  Support
                </Button>
              </ListItem>
            </List>
          </Box>

          {/* Logout Section */}
          <List>
            <ListItem
              button
              onClick={handleLogoutClick}
              sx={{
                backgroundColor: '#5a5a5a',
                borderRadius: '4px',
                padding: '6px 12px',
                textAlign: 'left',
                justifyContent: 'flex-start',
                fontSize: '0.875rem',
                mt: 2,
                '&:hover': {
                  backgroundColor: '#494949',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px', color: 'white' }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <Typography>Logout</Typography>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            bgcolor: '#f3f3f3',
            color: 'black',
            borderRadius: '10px',
            width: '300px',
            maxWidth: '300px',
            height: '180px',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold', color: '#3b3b3b' }}>
          Are you sure you want to logout now?
        </DialogTitle>
        <Divider sx={{ borderColor: '#dedede', borderWidth: '1px', borderRadius: '10px', mb: 2, mr: 1.5, ml: 1.5 }} />
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-around', paddingBottom: '10px', fontSize: '1.1rem' }}>
          <Button
            onClick={handleLogoutCancel}
            variant="contained"
            sx={{
              bgcolor: '#dedede',
              color: '#4d4d4d',
              borderRadius: '5px',
              padding: '6px 24px',
              width: '140px',
              border: '1px solid transparent',
              '&:hover': {
                bgcolor: '#898989',
                border: '1px solid #4d4d4d',
              },
              '&:active': {
                bgcolor: '#dedede',
                border: '1px solid #4d4d4d',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            sx={{
              bgcolor: '#dedede',
              color: 'red',
              borderRadius: '5px',
              padding: '6px 24px',
              width: '140px',
              border: '1px solid transparent',
              '&:hover': {
                bgcolor: '#898989',
                border: '1px solid red',
              },
              '&:active': {
                bgcolor: '#dedede',
                border: '1px solid red',
              },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserSidebar;
