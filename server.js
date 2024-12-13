const express = require("express");
const fetch = require("node-fetch");
const app = express();

// Use the PORT environment variable provided by Heroku
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Example endpoint
app.post("/chat", async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini-2024-07-18",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 100,
            }),
        });
        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal server error");
    }
});

// Start the server and bind to the PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
