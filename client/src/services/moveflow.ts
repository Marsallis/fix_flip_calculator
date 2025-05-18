import axios from 'axios';

interface NeighborhoodInsightsParams {
  latitude: number;
  longitude: number;
  radius_miles: number;
}

const moveflowService = {
  getNeighborhoodInsights: async (params: NeighborhoodInsightsParams) => {
    try {
      console.log('Sending request to backend with params:', params);
      const response = await axios.post('http://localhost:3001/api/market-analysis/neighborhood-insights', params, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
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