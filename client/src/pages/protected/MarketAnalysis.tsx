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
  useTheme,
  Grid,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from '../../components/Navbar';
import moveflowService from '../../services/moveflow';

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

interface MarketAnalysisResults {
  area: string;
  properties: number;
  averagePrice: number;
  rawData?: any;
}

const MarketAnalysis: React.FC = () => {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    radius: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MarketAnalysisResults | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateInputs = () => {
    const { latitude, longitude, radius } = formData;
    if (!latitude || !longitude || !radius) {
      setError('Please enter valid numbers for Latitude, Longitude, and Radius');
      return false;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radius);

    if (isNaN(lat) || isNaN(lng) || isNaN(rad)) {
      setError('Please enter valid numbers for all fields');
      return false;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90 degrees');
      return false;
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180 degrees');
      return false;
    }

    if (rad <= 0) {
      setError('Radius must be greater than 0');
      return false;
    }

    return true;
  };

  const analyze = async () => {
    setError('');
    setResults(null);
    setLoading(true);

    try {
      // Validate inputs
      if (!validateInputs()) {
        setLoading(false);
        return;
      }

      const response = await moveflowService.getNeighborhoodInsights({
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        radius_miles: parseFloat(formData.radius)
      });

      console.log('Raw API Response:', response);

      setResults({
        area: `${formData.radius} mile radius`,
        properties: response.properties?.length || 0,
        averagePrice: response.average_price || 0,
        rawData: response
      });
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze market. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Navbar />
      <ProtectedPage title="Market Analysis">
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                    label="Latitude"
                    name="latitude"
                    type="number"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g. 40.7128"
                    inputProps={{ step: "any" }}
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Longitude"
                    name="longitude"
                    type="number"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g. -74.0060"
                    inputProps={{ step: "any" }}
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Radius (miles)"
                    name="radius"
                    type="number"
                    value={formData.radius}
                    onChange={handleInputChange}
                    placeholder="e.g. 5"
                    inputProps={{ step: "any" }}
                  />
                </Box>
                <Box>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={analyze}
                    size="large"
                    disabled={loading}
                  >
                    Analyze Market
                  </Button>
                </Box>
              </Box>
            </Box>

            {results && (
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Analysis Results
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1">Area Coverage</Typography>
                    <Typography variant="body1">{results.area}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1">Properties Found</Typography>
                    <Typography variant="body1">{results.properties}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1">Average Price</Typography>
                    <Typography variant="body1">
                      ${results.averagePrice.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Raw API Response
                  </Typography>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      backgroundColor: '#f5f5f5',
                      maxHeight: '400px',
                      overflow: 'auto'
                    }}
                  >
                    <pre style={{ margin: 0 }}>
                      {JSON.stringify(results.rawData, null, 2)}
                    </pre>
                  </Paper>
                </Box>
              </Paper>
            )}
          </StyledPaper>
        </Container>
      </ProtectedPage>
    </Box>
  );
};

export default MarketAnalysis; 