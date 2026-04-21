const axios = require("axios");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODELS = [
  "meta-llama/llama-3.2-3b-instruct:free",
  "openai/gpt-oss-20b:free",
  "google/gemma-3-4b:free",
];
const BATCH_SIZE = 10;
const ALLOWED_CATEGORIES = new Set([
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
]);

function chunkArray(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function buildPrompt(descriptions) {
  return `Classify each transaction into one of these categories: Food, Travel, Shopping, Bills, Entertainment, Other.

Return ONLY JSON array.

Transactions:
${descriptions.join("\n")}`;
}

function normalizeCategory(category) {
  const value = String(category || "").trim();

  if (value.toLowerCase() === "others") {
    return "Other";
  }

  return ALLOWED_CATEGORIES.has(value) ? value : "Other";
}

function parseAICategories(text, expectedLength) {
  try {
    const jsonMatch = String(text || "").match(/\[[\s\S]*\]/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);

    if (!Array.isArray(parsed)) {
      return null;
    }

    return Array.from({ length: expectedLength }, (_, index) =>
      normalizeCategory(parsed[index]),
    );
  } catch (error) {
    console.error("AI category parse failed:", error.message);
    return null;
  }
}

async function categorizeBatch(batch, apiKey) {
  const descriptions = batch.map((transaction) => transaction.description || "");
  const prompt = buildPrompt(descriptions);

  for (const model of MODELS) {
    try {
      console.log("Trying model:", model);

      const response = await axios.post(
        OPENROUTER_URL,
        {
          model,
          messages: [
            {
              role: "system",
              content: "You are a financial transaction classifier.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Bank Analyzer",
          },
        },
      );

      console.log("OpenRouter response:", response.data);

      const text = response.data?.choices?.[0]?.message?.content || "";
      const categories = parseAICategories(text, batch.length);

      if (!categories) {
        throw new Error("Failed to parse AI category response.");
      }

      console.log("Success with model:", model);
      return categories;
    } catch (error) {
      console.log("Model failed:", model, error.response?.data || error.message);
    }
  }

  return null;
}

async function categorizeWithAI(transactions) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === "your_key_here") {
    console.log("AI categorizer skipped: OPENROUTER_API_KEY is not configured.");
    return transactions;
  }

  const nextTransactions = [...(transactions || [])];
  const candidates = nextTransactions
    .map((transaction, index) => ({ transaction, index }))
    .filter(
      ({ transaction }) =>
        transaction.category === "Other" && transaction.type === "debit",
    );

  if (!candidates.length) {
    console.log("AI categorizer skipped: no Other debit transactions.");
    return nextTransactions;
  }

  console.log(`AI categorizer processing ${candidates.length} transactions.`);

  try {
    for (const batch of chunkArray(candidates, BATCH_SIZE)) {
      const categories = await categorizeBatch(
        batch.map(({ transaction }) => transaction),
        apiKey,
      );

      if (!categories) {
        console.log("All AI models failed, using fallback.");
        return transactions;
      }

      batch.forEach(({ index }, batchIndex) => {
        nextTransactions[index] = {
          ...nextTransactions[index],
          category: categories[batchIndex] || "Other",
        };
      });
    }

    return nextTransactions;
  } catch (error) {
    console.error("AI categorizer failed:", error.response?.data || error.message);
    return transactions;
  }
}

module.exports = { categorizeWithAI };
