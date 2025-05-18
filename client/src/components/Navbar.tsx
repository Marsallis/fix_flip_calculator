import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CalculateIcon from '@mui/icons-material/Calculate';
import authService from '../services/auth';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
}));

const NavButton = styled(Button)<{ active?: boolean }>(({ theme, active }) => ({
  color: active ? theme.palette.text.primary : theme.palette.text.secondary,
  borderBottom: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  borderRadius: 0,
  padding: theme.spacing(1, 2),
  '&:hover': {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: 'transparent',
  },
}));

const ActiveNavButton = styled(NavButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderBottom: `2px solid ${theme.palette.primary.main}`,
}));

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <CalculateIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
            ROI Calculator
          </Typography>
          <Box sx={{ ml: 4, display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            <NavButton
              active={isActive('/dashboard')}
              onClick={() => navigate('/dashboard')}
            >
              Home
            </NavButton>
            <NavButton
              active={isActive('/calculator')}
              onClick={() => navigate('/calculator')}
            >
              Calculator
            </NavButton>
            <NavButton
              active={isActive('/rehab-calculator')}
              onClick={() => navigate('/rehab-calculator')}
            >
              Rehab Calculator
            </NavButton>
            <NavButton
              active={isActive('/mortgage-calculator')}
              onClick={() => navigate('/mortgage-calculator')}
            >
              Mortgage Calculator
            </NavButton>
            <NavButton
              active={isActive('/market-analysis')}
              onClick={() => navigate('/market-analysis')}
            >
              Market Analysis
            </NavButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Logout
          </Button>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{ display: { sm: 'none' } }}
          >
            <AccountCircle />
          </IconButton>
        </Box>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar; 