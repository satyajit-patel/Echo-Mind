// server.js (Node.js Express Backend)
const express = require("express");
const { ElevenLabsClient } = require("elevenlabs");
const Groq = require("groq-sdk");
const { Readable } = require("stream");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

async function generateAIResponse(inputValue) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are an AI assistant that provides short, concise, and accurate responses." },
                { role: "user", content: inputValue },
            ],
            model: "llama-3.3-70b-versatile",
        });

        if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
            throw new Error("AI response is empty.");
        }

        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error("Groq API Error:", error);
        throw new Error("Failed to generate AI response.");
    }
}


app.post("/api/v1/voice", async (req, res) => {
  try {
    const {inputValue} = await req.body;
    const text = await generateAIResponse(inputValue);
    console.log(text);
    const audioStream = await client.textToSpeech.convertAsStream("JBFqnCBsd6RMkjVDRZzb", {
      text,
      model_id: "eleven_multilingual_v2",
    });

    res.setHeader("Content-Type", "audio/mpeg");
    Readable.from(audioStream).pipe(res);
  } catch (error) {
    console.error("Error streaming audio:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/ping", (req, res) => {
  res.send("pong")
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
