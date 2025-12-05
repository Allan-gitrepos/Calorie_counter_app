// Gemini API Module
const Gemini = {
    apiBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/',

    getModel() {
        return Storage.getModel() || 'gemini-2.0-flash';
    },

    getApiUrl() {
        return `${this.apiBaseUrl}${this.getModel()}:generateContent`;
    },

    getSystemPrompt() {
        const user = Storage.getUser();
        return `You are FitCalo AI, a friendly nutrition assistant helping users track calories.

USER PROFILE:
- Name: ${user?.name || 'User'}
- Daily Calorie Goal: ${user?.dailyCalories || 2000} kcal
- Goal: ${user?.goal || 'maintain'} weight

RESPONSE FORMAT - CRITICAL:
Always include a JSON block with nutrition data.

For FOOD/MEALS, respond with JSON:
\`\`\`json
{
  "meal": {
    "name": "Meal Name",
    "totalCalories": 500,
    "items": [
      {"name": "Item 1", "quantity": 1, "calories": 200, "carbs": 30, "protein": 10, "fat": 8},
      {"name": "Item 2", "quantity": 1, "calories": 300, "carbs": 40, "protein": 15, "fat": 12}
    ]
  }
}
\`\`\`

For ACTIVITY/EXERCISE, respond with JSON:
\`\`\`json
{
  "activity": {
    "name": "Running",
    "duration": "30 min",
    "calories": 300
  }
}
\`\`\`

Keep text responses brief and friendly with emojis. The JSON handles all the data.`;
    },

    async sendMessage(message, imageBase64 = null) {
        const apiKey = Storage.getApiKey();
        if (!apiKey) throw new Error('API key not configured');

        const parts = [];

        if (imageBase64) {
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
            parts.push({
                inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Data
                }
            });
        }

        parts.push({
            text: message || 'Analyze this food image. Identify all items and provide nutrition info.'
        });

        const requestBody = {
            contents: [
                { role: 'user', parts: [{ text: this.getSystemPrompt() }] },
                { role: 'model', parts: [{ text: 'Understood! I will analyze food and provide structured nutrition data. Send me a photo or describe what you ate! 🍎' }] },
                { role: 'user', parts: parts }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048
            }
        };

        try {
            const response = await fetch(`${this.getApiUrl()}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'API request failed');
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t process that.';

            const extractedData = this.extractJsonFromResponse(text);

            return {
                text: this.formatResponseText(text),
                meal: extractedData?.meal || null,
                activity: extractedData?.activity || null
            };
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    },

    extractJsonFromResponse(text) {
        // Try JSON code block first
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[1]);
            } catch (e) {
                console.warn('Failed to parse JSON from code block');
            }
        }

        // Try raw JSON with meal
        const mealMatch = text.match(/\{[\s\S]*"meal"[\s\S]*\}/);
        if (mealMatch) {
            try {
                return JSON.parse(mealMatch[0]);
            } catch (e) {
                console.warn('Failed to parse meal JSON');
            }
        }

        // Try raw JSON with activity
        const activityMatch = text.match(/\{[\s\S]*"activity"[\s\S]*\}/);
        if (activityMatch) {
            try {
                return JSON.parse(activityMatch[0]);
            } catch (e) {
                console.warn('Failed to parse activity JSON');
            }
        }

        return null;
    },

    formatResponseText(text) {
        // Remove JSON blocks
        let cleaned = text
            .replace(/```json\s*[\s\S]*?\s*```/g, '')
            .replace(/\{[\s\S]*"meal"[\s\S]*\}/g, '')
            .replace(/\{[\s\S]*"activity"[\s\S]*\}/g, '')
            .trim();

        // Clean up whitespace
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

        // Simple markdown to HTML
        cleaned = cleaned
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');

        return cleaned || 'Here\'s what I found! 👆';
    }
};
