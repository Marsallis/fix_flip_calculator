import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedPage from './ProtectedPage';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CalculateIcon from '@mui/icons-material/Calculate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import authService from '../../services/auth';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  borderBottom: '2px solid transparent',
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

const FeatureIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 48,
  width: 48,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
}));

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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

  const features = [
    {
      title: 'Accurate Calculations',
      description: 'Get precise ROI calculations based on purchase price, repair costs, and selling price.',
      icon: <CalculateIcon />,
    },
    {
      title: 'Investment Analysis',
      description: 'Analyze potential returns with detailed breakdowns of costs and profits.',
      icon: <TrendingUpIcon />,
    },
    {
      title: 'Assignment Fee Calculator',
      description: 'Calculate optimal assignment fees based on your desired ROI.',
      icon: <AttachMoneyIcon />,
    },
    {
      title: 'ROI Variance',
      description: 'See how different ROI percentages affect your potential returns.',
      icon: <PercentIcon />,
    },
  ];

  return (
    <Box>
      <StyledAppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <CalculateIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
              ROI Calculator
            </Typography>
            <Box sx={{ ml: 4, display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
              <ActiveNavButton>Home</ActiveNavButton>
              <NavButton onClick={() => navigate('/calculator')}>Calculator</NavButton>
              <NavButton onClick={() => navigate('/rehab-calculator')}>Rehab Calculator</NavButton>
              <NavButton onClick={() => navigate('/mortgage-calculator')}>Mortgage Calculator</NavButton>
              <NavButton onClick={() => navigate('/market-analysis')}>Market Analysis</NavButton>
            </Box>
          </Box>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
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

      {/* Hero Section */}
      <Box sx={{ position: 'relative', bgcolor: 'white', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4, py: 8 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
                  lineHeight: 1.2,
                }}
              >
                <Box component="span" display="block">
                  Fix & Flip ROI
                </Box>
                <Box component="span" display="block" color="primary.main">
                  Calculator
                </Box>
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mt: 3, mb: 4, maxWidth: 'xl' }}
              >
                Make informed investment decisions with our comprehensive Fix & Flip ROI Calculator. Calculate potential returns, analyze costs, and determine optimal offer prices - all in one place.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/calculator')}
                sx={{ px: 4, py: 1.5 }}
              >
                Start Calculating
              </Button>
            </Box>
            <Box sx={{ flex: 1, display: { xs: 'none', lg: 'block' } }}>
              <Box
                component="img"
                src="https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="House renovation"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="subtitle1"
              color="primary"
              sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}
            >
              Features
            </Typography>
            <Typography
              variant="h3"
              sx={{ mt: 2, fontWeight: 800 }}
            >
              Everything you need to calculate ROI
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            {features.map((feature, index) => (
              <Box key={index} sx={{ position: 'relative', pl: 8 }}>
                <FeatureIcon sx={{ position: 'absolute', left: 0, top: 0 }}>
                  {feature.icon}
                </FeatureIcon>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'grey.900', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="grey.400" align="center">
            &copy; 2024 Fix & Flip ROI Calculator. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard; 