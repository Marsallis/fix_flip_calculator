import axios from 'axios';

interface NeighborhoodInsightsParams {
  latitude: number;
  longitude: number;
  radius_miles: number;
}

interface GeocodeParams {
  address: string;
}

const moveflowService = {
  getGoogleGeocode: async (params: GeocodeParams) => {
    try {
      console.log('Sending Google geocoding request with address:', params.address);
      const response = await axios.post('http://localhost:3001/api/market-analysis/google-geocode', params, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Received Google geocoding response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in Google geocoding:', error);
      throw error;
    }
  },

  getNeighborhoodInsights: async (params: NeighborhoodInsightsParams) => {
    try {
      console.log('Sending request to backend with params:', params);
      const response = await axios.post('http://localhost:3001/api/market-analysis/neighborhood-insights', params, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Received response from backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in moveflowService:', error);
      throw error;
    }
  }
};

export default moveflowService; 