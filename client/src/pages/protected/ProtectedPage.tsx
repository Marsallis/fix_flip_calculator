import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box } from '@mui/material';
import authService from '../../services/auth';

interface ProtectedPageProps {
  title: string;
  children: React.ReactNode;
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ title, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = authService.getToken();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          {children}
        </Paper>
      </Box>
    </Container>
  );
};

export default ProtectedPage; 