const axios = require('axios');
const qs = require('qs');

exports.getZoomAccessToken = async () => {
  const tokenUrl = 'https://zoom.us/oauth/token';

  const payload = qs.stringify({
    grant_type: 'account_credentials',
    account_id: process.env.ZOOM_ACCOUNT_ID,
  });

  const headers = {
    'Authorization': 'Basic ' + Buffer.from(
      `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
    ).toString('base64'),
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const response = await axios.post(tokenUrl, payload, { headers });
    return response.data.access_token;
  } catch (error) {
    // Simplified error logging
    if (error.response) {
      console.error(`Zoom Access Token error: ${error.response.status} - ${error.response.statusText}`);
    } else {
      console.error('Zoom Access Token error:', error.message);
    }
    throw error;  // Rethrow the error to propagate it to the caller
  }
};
