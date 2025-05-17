import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

interface ButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  fullWidth = false,
  variant = 'contained',
  color = 'primary',
  onClick,
  type = 'button',
  disabled = false,
  startIcon,
  endIcon,
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      endIcon={endIcon}
    >
      {children}
    </MuiButton>
  );
};

export default Button; 