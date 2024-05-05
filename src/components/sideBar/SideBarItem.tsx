import React, { ReactElement } from 'react';
import { useMatch, Link } from 'react-router-dom';
import { ListItem, IconButton, Typography } from '@mui/material';

type SidebarItemProps = {
  text: string;
  icon: ReactElement;
  path: string;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ text, icon, path }) => {
  const match = useMatch(path);

  return (
    <ListItem
      component={Link}
      to={path}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        color: match ? 'primary.main' : '#000048',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <IconButton sx={{ color: match ? 'primary.main' : '#000048' }}>
        {React.cloneElement(icon, {
          color: match ? 'primary' : '#000048',
        })}
      </IconButton>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {text}
      </Typography>
    </ListItem>
  );
};

export default SidebarItem;
