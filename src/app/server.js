const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = 3003;

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Server is running!");
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/send-message", async (req, res) => {
  try {
    const { input, conversation } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a supportive and empathetic friend and helper.",
        },
        ...conversation, // Hela konversationen skickas med varje anrop
        { role: "user", content: input },
      ],
      model: "gpt-3.5-turbo",
    });

    const response = completion.choices[0].message.content.trim();
    res.json({
      response,
      conversation: [...conversation, { role: "assistant", content: response }],
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/generate-positive-quote", async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await openai.completions.create({
      prompt: prompt,
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 50,
    });

    const generatedQuote = completion.choices[0].text.trim();
    res.json({ generatedQuote });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
