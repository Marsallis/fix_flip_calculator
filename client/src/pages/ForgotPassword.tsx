import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Paper, Typography, Box, Link, Alert } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Email as EmailIcon } from '@mui/icons-material';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import authService from '../services/auth';

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await authService.forgotPassword(values.email);
        setSuccess(true);
      } catch (error: any) {
        formik.setErrors({
          email: error.response?.data?.message || 'Failed to send reset link',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
            Enter your email to reset your password
          </Typography>

          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset link has been sent to your email. Please check your inbox.
            </Alert>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <Input
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email ? formik.errors.email : undefined}
                startIcon={<EmailIcon />}
                required
              />

              <Button
                type="submit"
                fullWidth
                loading={loading}
                variant="contained"
                color="primary"
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{' '}
              <Link component={RouterLink} to="/login">
                Back to login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword; 