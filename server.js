const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// WhatsApp Cloud API credentials
const TOKEN = "YOUR_META_ACCESS_TOKEN";  // from Meta Developer Console
const PHONE_NUMBER_ID = "YOUR_PHONE_NUMBER_ID"; // from Meta Developer Console
const TO_NUMBER = "919384999095"; // recipient number

// WhatsApp API route
app.post("/send-whatsapp", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: TO_NUMBER,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
