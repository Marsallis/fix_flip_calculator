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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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

interface RehabItem {
  id: string;
  category: string;
  description: string;
  cost: string;
}

interface RehabResults {
  totalCost: number;
  contingency: number;
  grandTotal: number;
  itemsByCategory: { [key: string]: number };
}

const RehabCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    propertyValue: '',
    contingencyRate: '10',
  });

  const [rehabItems, setRehabItems] = useState<RehabItem[]>([]);
  const [newItem, setNewItem] = useState<RehabItem>({
    id: '',
    category: '',
    description: '',
    cost: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RehabResults | null>(null);

  const categories = [
    'Exterior',
    'Interior',
    'Kitchen',
    'Bathroom',
    'Plumbing',
    'Electrical',
    'HVAC',
    'Flooring',
    'Roofing',
    'Other',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | { target: { name: string; value: unknown } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | { target: { name: string; value: unknown } }) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const addRehabItem = () => {
    if (!newItem.category || !newItem.description || !newItem.cost) {
      setError('Please fill in all fields for the new item');
      return;
    }

    const item: RehabItem = {
      ...newItem,
      id: Date.now().toString(),
    };

    setRehabItems(prev => [...prev, item]);
    setNewItem({
      id: '',
      category: '',
      description: '',
      cost: '',
    });
    setError(null);
  };

  const removeRehabItem = (id: string) => {
    setRehabItems(prev => prev.filter(item => item.id !== id));
  };

  const calculate = () => {
    try {
      setError(null);

      if (!formData.propertyValue) {
        setError('Please enter the property value');
        return;
      }

      if (rehabItems.length === 0) {
        setError('Please add at least one rehab item');
        return;
      }

      const totalCost = rehabItems.reduce((sum, item) => sum + parseFloat(item.cost || '0'), 0);
      const contingencyRate = parseFloat(formData.contingencyRate) / 100;
      const contingency = totalCost * contingencyRate;
      const grandTotal = totalCost + contingency;

      // Calculate costs by category
      const itemsByCategory = rehabItems.reduce((acc, item) => {
        const cost = parseFloat(item.cost || '0');
        acc[item.category] = (acc[item.category] || 0) + cost;
        return acc;
      }, {} as { [key: string]: number });

      setResults({
        totalCost,
        contingency,
        grandTotal,
        itemsByCategory,
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
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
                    label="Property Value ($)"
                    name="propertyValue"
                    type="number"
                    value={formData.propertyValue}
                    onChange={handleInputChange}
                    placeholder="e.g. 200000"
                  />
                </Box>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel>Contingency Rate (%)</InputLabel>
                    <Select
                      name="contingencyRate"
                      value={formData.contingencyRate}
                      onChange={handleInputChange}
                      label="Contingency Rate (%)"
                    >
                      <MenuItem value="5">5%</MenuItem>
                      <MenuItem value="10">10%</MenuItem>
                      <MenuItem value="15">15%</MenuItem>
                      <MenuItem value="20">20%</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Typography variant="h6" gutterBottom>
                  Add Rehab Items
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={newItem.category}
                      onChange={handleNewItemChange}
                      label="Category"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={newItem.description}
                    onChange={handleNewItemChange}
                    placeholder="e.g. Kitchen cabinets"
                  />
                  <TextField
                    fullWidth
                    label="Cost ($)"
                    name="cost"
                    type="number"
                    value={newItem.cost}
                    onChange={handleNewItemChange}
                    placeholder="e.g. 5000"
                  />
                  <IconButton
                    color="primary"
                    onClick={addRehabItem}
                    sx={{ mt: 1 }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                {rehabItems.length > 0 && (
                  <List>
                    {rehabItems.map((item) => (
                      <ListItem key={item.id}>
                        <ListItemText
                          primary={item.description}
                          secondary={`${item.category} - ${formatCurrency(parseFloat(item.cost))}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => removeRehabItem(item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}

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
                      Total Rehab Cost
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {formatCurrency(results.totalCost)}
                    </Typography>
                  </ResultCard>
                  <ResultCard>
                    <Typography variant="subtitle1" gutterBottom>
                      Contingency ({formData.contingencyRate}%)
                    </Typography>
                    <Typography>
                      {formatCurrency(results.contingency)}
                    </Typography>
                  </ResultCard>
                  <ResultCard>
                    <Typography variant="subtitle1" gutterBottom>
                      Grand Total
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {formatCurrency(results.grandTotal)}
                    </Typography>
                  </ResultCard>
                  <ResultCard>
                    <Typography variant="subtitle1" gutterBottom>
                      Costs by Category
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {Object.entries(results.itemsByCategory).map(([category, cost]) => (
                        <Box key={category} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>{category}</Typography>
                          <Typography>{formatCurrency(cost)}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </ResultCard>
                </Box>
              </Box>
            )}
          </StyledPaper>
        </Paper>
      </Container>
    </Box>
  );
};

export default RehabCalculator; 