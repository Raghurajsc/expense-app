const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


async function analyzeExpenses(expenses) {

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
        Analyze these expenses and give simple financial advice:

        ${JSON.stringify(expenses)}
        `
    });

    return response.text;
}
async function suggestCategory(description) {

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
        Categorize this expense description.

        Return only one category from:
        Food, Travel, Shopping, Bills, Entertainment, Other.

        Expense description:
        ${description}
        `
    });

    return response.text.trim();
}


module.exports = {
    analyzeExpenses,
    suggestCategory
};