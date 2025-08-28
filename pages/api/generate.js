// pages/api/generate.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  if (!configuration.apiKey) {
    return res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please add it in your environment variables.",
      },
    });
  }

  const ingredient = req.body.ingredient || "";
  if (ingredient.trim().length === 0) {
    return res.status(400).json({
      error: { message: "Please enter a valid ingredient." },
    });
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(ingredient),
      max_tokens: 200,
      temperature: 0.6,
    });

    // Return result safely
    const text = completion.data.choices[0]?.text?.trim();
    res.status(200).json({ result: text });
  } catch (error) {
    console.error("OpenAI API error:", error);

    if (error.response) {
      return res
        .status(error.response.status)
        .json(error.response.data);
    } else {
      return res.status(500).json({
        error: {
          message: "Something went wrong with the request.",
        },
      });
    }
  }
}

function generatePrompt(ingredient) {
  const capitalizedIngredient =
    ingredient[0].toUpperCase() + ingredient.slice(1).toLowerCase();
  return `Suggest three generic recipes for the ingredients entered.

ingredient: potato cream cheese onion
Recipes: Mashed potato with cream cheese, Onion and potato hash, Baked Fries

ingredient: garlic pasta chicken
Recipes: Chicken tomato pasta bake, Easy Garlic Chicken Pasta, Garlic butter chicken pesto pasta

ingredient: ${capitalizedIngredient}
Recipes:`;
}
