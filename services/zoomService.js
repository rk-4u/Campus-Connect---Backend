const axios = require('axios');
const { getZoomAccessToken } = require('./zoomAuthService');

exports.scheduleZoomMeeting = async (meetingData) => {
  try {
    const accessToken = await getZoomAccessToken();

    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      meetingData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    // Logging only the relevant error message to avoid excessive data
    if (error.response) {
      console.error(`Zoom API error: ${error.response.status} - ${error.response.statusText}`);
    } else {
      console.error('Zoom API error:', error.message);
    }
    throw error;  // Rethrow the error for further handling upstream
  }
};
