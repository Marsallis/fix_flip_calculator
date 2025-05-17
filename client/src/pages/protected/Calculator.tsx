import React, { useState } from 'react';
import ProtectedPage from './ProtectedPage';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Paper,
  Grid,
  Container,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from '../../components/Navbar';

// Styled components
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

interface CalculatorResults {
  purchasePrices: {
    lower: number;
    target: number;
    upper: number;
  };
  wholesaleOffers: {
    lower: number;
    target: number;
    upper: number;
  };
  profits: {
    lower: { amount: number; roi: number };
    target: { amount: number; roi: number };
    upper: { amount: number; roi: number };
  };
  investmentSummary: {
    totalInvestment: number;
  };
}

const Calculator: React.FC = () => {
  const [formData, setFormData] = useState({
    sellerPrice: '',
    arv: '',
    rehabCosts: '',
    closingCosts: '6',
    desiredROI: '12',
    roiVariance: '2',
    assignmentFee: '10000'
  });

  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateInputs = () => {
    const { sellerPrice, arv, rehabCosts } = formData;
    if (!sellerPrice || !arv || !rehabCosts) {
      setError('Please enter valid numbers for Seller Price, ARV, and Rehab Costs');
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

      const sellerPrice = parseFloat(formData.sellerPrice);
      const arv = parseFloat(formData.arv);
      const rehabCosts = parseFloat(formData.rehabCosts);
      const closingCostsPercent = parseFloat(formData.closingCosts) / 100 || 0.06;
      const desiredROIPercent = parseFloat(formData.desiredROI) || 12;
      const roiVariancePercent = parseFloat(formData.roiVariance) || 2;
      const desiredAssignmentFee = parseFloat(formData.assignmentFee) || 10000;

      if (arv <= 0 || sellerPrice <= 0 || rehabCosts < 0) {
        setError('Please enter valid positive numbers for ARV, Seller Price, and Rehab Costs.');
        return;
      }

      const lowerROI = desiredROIPercent - roiVariancePercent;
      const targetROI = desiredROIPercent;
      const upperROI = desiredROIPercent + roiVariancePercent;

      const purchasePriceForROI = (arv: number, rehabCosts: number, closingCostsPercent: number, roi: number) => {
        const cc = arv * closingCostsPercent;
        const roiDecimal = roi / 100;
        const totalCosts = rehabCosts + cc;
        const denominator = 1 + roiDecimal;
        return (arv - totalCosts * denominator) / denominator;
      };

      const purchasePriceLower = purchasePriceForROI(arv, rehabCosts, closingCostsPercent, lowerROI);
      const purchasePriceTarget = purchasePriceForROI(arv, rehabCosts, closingCostsPercent, targetROI);
      const purchasePriceUpper = purchasePriceForROI(arv, rehabCosts, closingCostsPercent, upperROI);

      const adjustedFeeLower = Math.max(0, desiredAssignmentFee - (purchasePriceLower - purchasePriceTarget));
      const adjustedFeeUpper = desiredAssignmentFee;

      const wholesaleOfferLower = purchasePriceLower - adjustedFeeLower;
      const wholesaleOfferTarget = purchasePriceTarget - desiredAssignmentFee;
      const wholesaleOfferUpper = purchasePriceUpper - adjustedFeeUpper;

      const calculateROIAndProfit = (purchasePrice: number) => {
        const cc = arv * closingCostsPercent;
        const profit = arv - purchasePrice - rehabCosts - cc;
        const totalInvestment = purchasePrice + rehabCosts + cc;
        const roi = (profit / totalInvestment) * 100;
        return { roi, profit };
      };

      const { roi: roiLower, profit: profitLower } = calculateROIAndProfit(purchasePriceLower);
      const { roi: roiTarget, profit: profitTarget } = calculateROIAndProfit(purchasePriceTarget);
      const { roi: roiUpper, profit: profitUpper } = calculateROIAndProfit(purchasePriceUpper);

      const investorAllIn = purchasePriceTarget + rehabCosts + (arv * closingCostsPercent);

      setResults({
        purchasePrices: {
          lower: purchasePriceLower,
          target: purchasePriceTarget,
          upper: purchasePriceUpper
        },
        wholesaleOffers: {
          lower: wholesaleOfferLower,
          target: wholesaleOfferTarget,
          upper: wholesaleOfferUpper
        },
        profits: {
          lower: { amount: profitLower, roi: roiLower },
          target: { amount: profitTarget, roi: roiTarget },
          upper: { amount: profitUpper, roi: roiUpper }
        },
        investmentSummary: {
          totalInvestment: investorAllIn
        }
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
      maximumFractionDigits: 2
    }).format(number);
  };

  return (
    <Box>
      <Navbar />
      <ProtectedPage title="Fix & Flip ROI Calculator">
        <Container maxWidth="md">
          <StyledPaper>
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
                    label="Seller's Asking Price ($)"
                    name="sellerPrice"
                    type="number"
                    value={formData.sellerPrice}
                    onChange={handleInputChange}
                    placeholder="e.g. 300000"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="After Repair Value (ARV) ($)"
                    name="arv"
                    type="number"
                    value={formData.arv}
                    onChange={handleInputChange}
                    placeholder="e.g. 400000"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Rehab + Holding Costs ($)"
                    name="rehabCosts"
                    type="number"
                    value={formData.rehabCosts}
                    onChange={handleInputChange}
                    placeholder="e.g. 50000"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Closing Costs Percentage (default 6%)"
                    name="closingCosts"
                    type="number"
                    value={formData.closingCosts}
                    onChange={handleInputChange}
                    placeholder="e.g. 6"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Desired ROI Percentage (default 12%)"
                    name="desiredROI"
                    type="number"
                    value={formData.desiredROI}
                    onChange={handleInputChange}
                    placeholder="e.g. 12"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="ROI Variance Percentage (+/- %, default 2%)"
                    name="roiVariance"
                    type="number"
                    value={formData.roiVariance}
                    onChange={handleInputChange}
                    placeholder="e.g. 2"
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Desired Assignment Fee ($, default 10000)"
                    name="assignmentFee"
                    type="number"
                    value={formData.assignmentFee}
                    onChange={handleInputChange}
                    placeholder="e.g. 10000"
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
                      Investor Prices
                    </Typography>
                    <Typography>
                      @ {parseFloat(formData.desiredROI) - parseFloat(formData.roiVariance)}% ROI: {formatCurrency(results.purchasePrices.lower)}
                    </Typography>
                    <Typography>
                      @ {formData.desiredROI}% ROI (Target): {formatCurrency(results.purchasePrices.target)}
                    </Typography>
                    <Typography>
                      @ {parseFloat(formData.desiredROI) + parseFloat(formData.roiVariance)}% ROI: {formatCurrency(results.purchasePrices.upper)}
                    </Typography>
                  </ResultCard>
                  <ResultCard>
                    <Typography variant="subtitle1" gutterBottom>
                      Wholesale Offers
                    </Typography>
                    <Typography>
                      @ {parseFloat(formData.desiredROI) - parseFloat(formData.roiVariance)}% ROI: {formatCurrency(results.wholesaleOffers.lower)}
                    </Typography>
                    <Typography>
                      @ {formData.desiredROI}% ROI: {formatCurrency(results.wholesaleOffers.target)}
                    </Typography>
                    <Typography>
                      @ {parseFloat(formData.desiredROI) + parseFloat(formData.roiVariance)}% ROI: {formatCurrency(results.wholesaleOffers.upper)}
                    </Typography>
                  </ResultCard>
                  <ResultCard>
                    <Typography variant="subtitle1" gutterBottom>
                      Profit Analysis
                    </Typography>
                    <Typography>
                      @ {parseFloat(formData.desiredROI) - parseFloat(formData.roiVariance)}% ROI: {formatCurrency(results.profits.lower.amount)} | ROI: {results.profits.lower.roi.toFixed(2)}%
                    </Typography>
                    <Typography>
                      @ {formData.desiredROI}% ROI: {formatCurrency(results.profits.target.amount)} | ROI: {results.profits.target.roi.toFixed(2)}%
                    </Typography>
                    <Typography>
                      @ {parseFloat(formData.desiredROI) + parseFloat(formData.roiVariance)}% ROI: {formatCurrency(results.profits.upper.amount)} | ROI: {results.profits.upper.roi.toFixed(2)}%
                    </Typography>
                  </ResultCard>
                  <ResultCard>
                    <Typography variant="subtitle1" gutterBottom>
                      Investment Summary
                    </Typography>
                    <Typography>
                      Investor Total Investment (All-In, excl. Assignment Fee): {formatCurrency(results.investmentSummary.totalInvestment)}
                    </Typography>
                  </ResultCard>
                </Box>
              </Box>
            )}
          </StyledPaper>
        </Container>
      </ProtectedPage>
    </Box>
  );
};

export default Calculator; 