import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  Divider,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import useQuery from '../../hooks/useQuery';
import { ENDPOINTS } from '../../constants/endpoints';
import { ROUTE_PATHS } from '../../constants/routePaths';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { HTTP_METHODS } from '../../constants/http';
import { useUser } from '../../context/UserContext';
import { ApiResponse, ErrorResponse } from '../../services/apiService';

const AccountSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useUser();

  const {
    data: userInfo,
    isLoading,
    getData,
    sendData,
  } = useQuery<{
    username: string;
    email: string;
    name: string;
    surname: string;
  }>({
    url: ENDPOINTS.USER_INFO,
  });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    surname: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    name: '',
    surname: '',
  });

  const [isEditable, setIsEditable] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.username || '',
        email: userInfo.email || '',
        name: userInfo.name || '',
        surname: userInfo.surname || '',
      });
    }
  }, [userInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      username: '',
      email: '',
      name: '',
      surname: '',
    };

    let isValid = true;

    if (!formData.username?.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    }
    if (!formData.name?.trim()) {
      newErrors.name = 'First Name is required';
      isValid = false;
    }
    if (!formData.surname?.trim()) {
      newErrors.surname = 'Last Name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const hasChanges = () => {
    return (
      formData.username !== userInfo?.username ||
      formData.email !== userInfo?.email ||
      formData.name !== userInfo?.name ||
      formData.surname !== userInfo?.surname
    );
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (!hasChanges()) return;
    const emailChanged = formData.email !== userInfo?.email;

    sendData(formData, HTTP_METHODS.PUT, ENDPOINTS.USER_UPDATE, user?.token).then(response => {
      if (response && (response as ApiResponse<any>).status === 200) {
        const updatedData = {
          username: formData.username,
          email: formData.email,
          name: formData.name,
          surname: formData.surname,
        };
        updateUser(updatedData);
        getData();
        setIsEditable(false);

        if (emailChanged) {
          setShowSnackbar(true);
          navigate(ROUTE_PATHS.CONFIRMATION_CODE, {
            state: {
              idToken: user?.idToken,
              isEmailUpdate: true,
            },
          });
        }
      } else if (response && (response as ErrorResponse).status) {
        const errorResponse = response as ErrorResponse;
        console.error(errorResponse.message);
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      username: userInfo?.username || '',
      email: userInfo?.email || '',
      name: userInfo?.name || '',
      surname: userInfo?.surname || '',
    });
    setIsEditable(false);
  };

  const handleDeleteAccount = () => {
    sendData(undefined, HTTP_METHODS.DELETE, ENDPOINTS.USER_DELETE, user?.token).then(response => {
      if (response && (response as ApiResponse<any>).status === 200) {
        alert('Your account has been deleted successfully.');
        logout().then(() => navigate(ROUTE_PATHS.HOME));
      } else if (response && (response as ErrorResponse).status) {
        const errorResponse = response as ErrorResponse;
        console.error(errorResponse.message);
      }
    });
  };

  return (
    <>
      <Header title="Account Settings" />
      <Container
        maxWidth="sm"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, mb: 8, height: '80vh' }}
      >
        <Box
          sx={{
            borderRadius: 2,
            padding: 2,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255)',
          }}
        >
          <Box
            sx={{
              padding: 2,
              mb: 3,
              position: 'relative',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              User Profile
            </Typography>
            {!isEditable && (
              <Box display="flex" justifyContent="flex-end">
                <IconButton
                  onClick={() => setIsEditable(true)}
                  sx={{
                    position: 'absolute',
                    top: '2px',
                    padding: '1px',
                  }}
                >
                  <EditIcon />
                  <Typography>Edit</Typography>
                </IconButton>
              </Box>
            )}

            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={!!errors.username}
              helperText={errors.username}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={!isEditable}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={!isEditable}
            />
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              margin="normal"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={!isEditable}
            />
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              margin="normal"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              error={!!errors.surname}
              helperText={errors.surname}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={!isEditable}
            />

            {isEditable && (
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 1,
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
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 1,
                    bgcolor: '#dedede',
                    color: 'green',
                    borderRadius: '5px',
                    padding: '6px 24px',
                    width: '140px',
                    border: '1px solid green',
                    '&:hover': {
                      bgcolor: '#898989',
                      border: '1px solid green',
                    },
                    '&:active': {
                      bgcolor: '#dedede',
                      border: '1px solid green',
                    },
                  }}
                  onClick={handleSubmit}
                  disabled={isLoading || !hasChanges()}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            )}
          </Box>

          {!isEditable && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                sx={{ mb: 2, width: '250px', bgcolor: '#9f1c1c' }}
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isLoading}
              >
                Delete Account
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold', color: '#3b3b3b' }}>
          Are you sure you want to delete your account?
        </DialogTitle>
        <Divider sx={{ borderColor: '#dedede', borderWidth: '1px', borderRadius: '10px', mb: 2, mr: 1.5, ml: 1.5 }} />
        <DialogActions
          sx={{ display: 'flex', justifyContent: 'space-around', paddingBottom: '10px', fontSize: '1.1rem' }}
        >
          <Button
            onClick={() => setDeleteDialogOpen(false)}
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
            onClick={handleDeleteAccount}
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="info" sx={{ width: '100%' }}>
          A confirmation code was sent to your new email.{' '}
          <a href={ROUTE_PATHS.CONFIRMATION_CODE}>Click here to confirm</a>.
        </Alert>
      </Snackbar>
      <Footer />
    </>
  );
};

export default AccountSettingsPage;
