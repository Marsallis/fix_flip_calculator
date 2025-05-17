import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onEndIconClick?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  fullWidth = true,
  startIcon,
  endIcon,
  onEndIconClick,
  placeholder,
  disabled = false,
}) => {
  return (
    <TextField
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
      required={required}
      fullWidth={fullWidth}
      placeholder={placeholder}
      disabled={disabled}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : undefined,
        endAdornment: endIcon ? (
          <InputAdornment position="end" onClick={onEndIconClick} style={{ cursor: 'pointer' }}>
            {endIcon}
          </InputAdornment>
        ) : undefined,
      }}
      variant="outlined"
      margin="normal"
    />
  );
};

export default Input; 