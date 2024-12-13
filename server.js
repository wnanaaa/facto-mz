const express = require("express");
const fetch = require("node-fetch");
const app = express();

const apiKey = "YOUR_API_KEY_HERE";

app.use(express.json());

app.post("/chat", async (req, res) => {
    const { prompt } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
        }),
    });

    const data = await response.json();
    res.json(data);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
