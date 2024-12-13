/*:
 * @target MZ
 * @plugindesc Integrates AI (e.g., ChatGPT) for dynamic dialogues and interactions.
 * @author Nana
 *
 * @help
 * This plugin connects RPG Maker MZ to OpenAI's ChatGPT API for dynamic responses.
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
    const apiKey = "YOUR_API_KEY"; // Replace with your actual API key
    const apiUrl = "https://shrouded-hamlet-24645-7f5b2e86a49d.herokuapp.com/chat"; // Make sure your Heroku server is running and accessible

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
            model: "gpt-4", // Ensure this model name is valid or adjust as needed
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
            console.log("API Response Data:", data);
            return data.choices[0].message.content; // Extract the message from the response
        } catch (error) {
            console.error("Fetch Error:", error);
            return "Error: Unable to connect to AI. Please try again later."; // User-friendly message
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
