import React, { useState } from 'react';
import ProtectedPage from './ProtectedPage';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Container,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from '../../components/Navbar';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ResultCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  marginBottom: theme.spacing(2),
}));

interface MortgageResults {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }[];
}

const MortgageCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    loanTerm: '30',
    downPayment: '',
    propertyTax: '',
    insurance: '',
    pmi: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MortgageResults | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | { target: { name: string; value: unknown } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const validateInputs = () => {
    const { loanAmount, interestRate, loanTerm } = formData;
    if (!loanAmount || !interestRate || !loanTerm) {
      setError('Please enter valid numbers for Loan Amount, Interest Rate, and Loan Term');
      return false;
    }
    return true;
  };

  const calculate = () => {
    try {
      setError(null);

      if (!validateInputs()) {
        return;
      }

      const principal = parseFloat(formData.loanAmount);
      const annualRate = parseFloat(formData.interestRate) / 100;
      const monthlyRate = annualRate / 12;
      const numberOfPayments = parseInt(formData.loanTerm) * 12;
      const monthlyPropertyTax = parseFloat(formData.propertyTax || '0') / 12;
      const monthlyInsurance = parseFloat(formData.insurance || '0') / 12;
      const monthlyPMI = parseFloat(formData.pmi || '0') / 12;

      // Calculate monthly payment using the mortgage payment formula
      const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      const totalMonthlyPayment = monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPMI;
      const totalPayment = totalMonthlyPayment * numberOfPayments;
      const totalInterest = totalPayment - principal;

      // Generate amortization schedule
      const schedule = [];
      let remainingBalance = principal;

      for (let month = 1; month <= numberOfPayments; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        schedule.push({
          month,
          payment: totalMonthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: Math.max(0, remainingBalance),
        });
      }

      setResults({
        monthlyPayment: totalMonthlyPayment,
        totalPayment,
        totalInterest,
        amortizationSchedule: schedule,
      });
    } catch (err) {
      setError('An error occurred during calculation');
    }
  };

  const formatCurrency = (number: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  return (
    <Box>
      <Navbar />
      <ProtectedPage title="Mortgage Calculator">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Loan Amount ($)"
                    name="loanAmount"
                    type="number"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    placeholder="e.g. 300000"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Interest Rate (%)"
                    name="interestRate"
                    type="number"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    placeholder="e.g. 3.5"
                  />
                </Box>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel>Loan Term (Years)</InputLabel>
                    <Select
                      name="loanTerm"
                      value={formData.loanTerm}
                      onChange={handleInputChange}
                      label="Loan Term (Years)"
                    >
                      <MenuItem value="15">15 Years</MenuItem>
                      <MenuItem value="20">20 Years</MenuItem>
                      <MenuItem value="30">30 Years</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Down Payment ($)"
                    name="downPayment"
                    type="number"
                    value={formData.downPayment}
                    onChange={handleInputChange}
                    placeholder="e.g. 60000"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Annual Property Tax ($)"
                    name="propertyTax"
                    type="number"
                    value={formData.propertyTax}
                    onChange={handleInputChange}
                    placeholder="e.g. 3000"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Annual Insurance ($)"
                    name="insurance"
                    type="number"
                    value={formData.insurance}
                    onChange={handleInputChange}
                    placeholder="e.g. 1200"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Annual PMI ($)"
                    name="pmi"
                    type="number"
                    value={formData.pmi}
                    onChange={handleInputChange}
                    placeholder="e.g. 600"
                  />
                </Box>
                <Box>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={calculate}
                    size="large"
                  >
                    Calculate
                  </Button>
                </Box>
              </Box>
            </Box>

            {results && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Results
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <ResultCard>
                    <Typography variant="subtitle1" gutterBottom>
                      Monthly Payment
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {formatCurrency(results.monthlyPayment)}
                    </Typography>
                  </ResultCard>
                  <ResultCard>
                    <Typography variant="subtitle1" gutterBottom>
                      Total Payment
                    </Typography>
                    <Typography>
                      {formatCurrency(results.totalPayment)}
                    </Typography>
                  </ResultCard>
                  <ResultCard>
                    <Typography variant="subtitle1" gutterBottom>
                      Total Interest
                    </Typography>
                    <Typography>
                      {formatCurrency(results.totalInterest)}
                    </Typography>
                  </ResultCard>
                  <ResultCard>
                    <Typography variant="subtitle1" gutterBottom>
                      Amortization Schedule (First 12 Months)
                    </Typography>
                    <Box sx={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Month</th>
                            <th style={{ padding: '8px', textAlign: 'right' }}>Payment</th>
                            <th style={{ padding: '8px', textAlign: 'right' }}>Principal</th>
                            <th style={{ padding: '8px', textAlign: 'right' }}>Interest</th>
                            <th style={{ padding: '8px', textAlign: 'right' }}>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.amortizationSchedule.slice(0, 12).map((row) => (
                            <tr key={row.month}>
                              <td style={{ padding: '8px', textAlign: 'left' }}>{row.month}</td>
                              <td style={{ padding: '8px', textAlign: 'right' }}>{formatCurrency(row.payment)}</td>
                              <td style={{ padding: '8px', textAlign: 'right' }}>{formatCurrency(row.principal)}</td>
                              <td style={{ padding: '8px', textAlign: 'right' }}>{formatCurrency(row.interest)}</td>
                              <td style={{ padding: '8px', textAlign: 'right' }}>{formatCurrency(row.remainingBalance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </ResultCard>
                </Box>
              </Box>
            )}
          </Paper>
        </Container>
      </ProtectedPage>
    </Box>
  );
};

export default MortgageCalculator; 