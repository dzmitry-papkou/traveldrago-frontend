import { Drawer, IconButton, List } from '@mui/material';
import ClassIcon from '@mui/icons-material/Class';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import { ROUTE_PATHS } from '../../constants/routePaths';
import SidebarItem from './SideBarItem';
import Logo from './Logo';

const SideBar = () => {
  const icons = [
    { text: 'Questions bank', icon: <ClassIcon />, path: ROUTE_PATHS.HOME },
    { text: 'Categories', icon: <CategoryIcon />, path: ROUTE_PATHS.CATEGORIES },
    { text: 'My Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  return (
    <Drawer
      sx={{ width: '100px', flexShrink: 0, '& .MuiDrawer-paper': { width: '100px', boxSizing: 'border-box' } }}
      variant="permanent"
      anchor="left"
    >
      <IconButton disabled aria-label="logo">
        <Logo />
      </IconButton>
      <List>
        {icons.map(({ text, icon, path }) => (
          <SidebarItem key={text} text={text} icon={icon} path={path} />
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;
