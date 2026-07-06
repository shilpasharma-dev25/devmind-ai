const axios = require("axios");

const getRecommendedResources = async (errorMessage) => {
  try {
    const response = await axios.post(
      process.env.N8N_WEBHOOK_URL,
      {
        errorMessage,
      }
    );

    console.log("========== n8n Raw Response ==========");
    console.log(response.data);
    console.log("======================================");

    // Return exactly what n8n sends
    return response.data;

  } catch (error) {
    console.error("n8n Error:", error.response?.data || error.message);

    return {
      resources: [],
    };
  }
};

module.exports = {
  getRecommendedResources,
};