const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
const port = 5000;

app.use(cors()); // Enable CORS for all requests

// Access Twitter API credentials from environment variables
const consumerKey = process.env.TWITTER_CONSUMER_KEY;
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const accessToken = process.env.TWITTER_ACCESS_TOKEN;
const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

// Helper function to encode credentials for basic authentication
function encodeCredentials(consumerKey, consumerSecret) {
  const encodedCredentials = Buffer.from(
    `${consumerKey}:${consumerSecret}`
  ).toString("base64");
  return encodedCredentials;
}

// Define a route to fetch data from the Twitter API
app.get("/api/get-tweet", async (req, res) => {
  try {
    const tweetId = req.query.id;

    // Create basic authentication credentials
    const basicAuth = encodeCredentials(consumerKey, consumerSecret);

    // Generate the Authorization header for Bearer token
    const authorizationHeader = `Bearer ${accessToken}`;

    // Fetch data from Twitter API
    const response = await axios.get(
      `https://api.twitter.com/1.1/statuses/show.json?id=${tweetId}&tweet_mode=extended`,
      {
        headers: {
          Authorization: authorizationHeader,
          // Optional: Include basic authentication header for fallback (some endpoints may require it)
          "Authorization-Basic": `Basic ${basicAuth}`,
        },
      }
    );

    // Return the entire response data from Twitter API
    res.json(response.data);

    // Alternatively, if you do not have a valid Twitter API key, you can return a dummy response. Comment out the above line and uncomment the line below:
    // res.json({ favorite_count: 336 });
  } catch (error) {
    // If there's an error, return an error response
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
