import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Paper, Typography, Box, Link, Checkbox, FormControlLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Email as EmailIcon, Lock as LockIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import authService from '../services/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await authService.login({
          email: values.email,
          password: values.password,
        });
        authService.setToken(response.token, values.remember);
        navigate('/dashboard');
      } catch (error: any) {
        formik.setErrors({
          email: error.response?.data?.message || 'Login failed',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoogleLogin = () => {
    authService.googleAuth();
  };

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
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
            Sign in to continue to DealScout
          </Typography>

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

            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password ? formik.errors.password : undefined}
              startIcon={<LockIcon />}
              endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
              onEndIconClick={() => setShowPassword(!showPassword)}
              required
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="remember"
                    checked={formik.values.remember}
                    onChange={formik.handleChange}
                  />
                }
                label="Remember me"
              />
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              variant="contained"
              color="primary"
            >
              Sign In
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/signup">
                Sign up
              </Link>
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleLogin}
            startIcon={<img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 20, height: 20 }} />}
          >
            Continue with Google
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 