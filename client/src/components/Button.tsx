import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'loading'> {
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ loading, children, disabled, ...props }) => {
  return (
    <MuiButton
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      ) : null}
      <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </span>
    </MuiButton>
  );
}; 