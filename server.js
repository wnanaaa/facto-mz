const express = require("express");
const fetch = require("node-fetch");
const app = express();

// Use the Heroku-provided port, or default to 3000 for local testing
const PORT = process.env.PORT || 3001;  // Ensure dynamic Heroku port binding
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());

// Example route to interact with the OpenAI API
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
                model: "gpt-4",
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

// Listen on the correct port for Heroku
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Global handler for uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Optionally, exit the process or perform cleanup tasks
    process.exit(1);
});

// Global handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Optionally, exit the process or perform cleanup tasks
    process.exit(1);
});