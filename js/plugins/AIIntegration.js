/*:
 * @target MZ
 * @plugindesc Integrates AI (e.g., ChatGPT) for dynamic dialogues and interactions without relying on Heroku.
 * @author Nana
 *
 * @help
 * This plugin connects RPG Maker MZ directly to OpenAI's API for dynamic responses.
 * 
 * Usage:
 * Use the Plugin Command "AIChat" to send a message to the AI and display its response.
 *
 * Plugin Commands:
 * - AIChat: Sends a prompt to the AI and displays the result in the game's message window.
 *
 * @command AIChat
 * @text Chat with AI
 * @desc Sends a prompt to the AI and displays the response.
 *
 * @arg message
 * @type string
 * @text Message
 * @desc The message to send to the AI.
 * @default Hello!
 */

(() => {
    const apiKey = process.env.OPENAI_API_KEY; // Fetch API key securely from environment variables
    const apiUrl = "https://api.openai.com/v1/chat/completions"; // OpenAI API URL

    /**
     * Fetches a response from the OpenAI API.
     * @param {string} prompt - The user's message or query.
     * @returns {Promise<string>} - The AI's response or an error message.
     */
    async function fetchAIResponse(prompt) {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        };

        const body = JSON.stringify({
            model: "gpt-4o-mini-2024-07-18", // Ensure you use the correct model here
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
        });

        try {
            console.log("Sending API request...");
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                body: body,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error Response:", errorText);
                return `Error: ${response.status} - ${response.statusText}`;
            }

            const data = await response.json();
            return data.choices[0].message.content; // Return the response from the AI
        } catch (error) {
            console.error("Fetch Error:", error);
            return "Error: Unable to connect to AI.";
        }
    }

    /**
     * Registers the AIChat command in the Plugin Manager.
     */
    PluginManager.registerCommand("AIIntegration", "AIChat", async (args) => {
        const prompt = args.message || "Hello!";
        console.log("Plugin Command Triggered with Prompt:", prompt);

        const response = await fetchAIResponse(prompt);
        console.log("AI Response:", response);

        $gameMessage.add(response); // Display the response in the game.
    });
})();
