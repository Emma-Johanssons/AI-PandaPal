const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://zippy-daffodil-402433.netlify.app/client",
      "http://localhost:3001",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Initialize OpenAI instance with API key logging
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);

// Endpoint for sending messages
app.post("/api/send-message", async (req, res) => {
  try {
    const { input, conversation } = req.body;

    // Make a request to OpenAI's chat endpoint
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a supportive and empathetic friend and helper.",
        },
        ...conversation,
        { role: "user", content: input },
      ],
      model: "gpt-3.5-turbo",
    });

    const response = completion.choices[0].message.content.trim();

    // Send the response and updated conversation back to the client
    res.json({
      response,
      conversation: [...conversation, { role: "assistant", content: response }],
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint for generating positive quotes
app.post("/api/generate-positive-quote", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Make a request to OpenAI's completions endpoint
    const completion = await openai.completions.create({
      prompt: prompt,
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 50,
    });

    const generatedQuote = completion.choices[0].text.trim();

    // Send the generated quote back to the client
    res.json({ generatedQuote });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Cloud Function for Firebase
exports.app = functions.https.onRequest(app);
