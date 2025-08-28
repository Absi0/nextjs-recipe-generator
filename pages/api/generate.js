import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please add it to .env.local",
      },
    });
    return;
  }

  const ingredient = req.body.ingredient || "";
  if (ingredient.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid ingredient",
      },
    });
    return;
  }

  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct", // ✅ updated model
      prompt: generatePrompt(ingredient),
      temperature: 0.6,
      max_tokens: 200,
    });

    res.status(200).json({ result: completion.choices[0].text.trim() });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(ingredient) {
  const capitalizedIngredient =
    ingredient[0].toUpperCase() + ingredient.slice(1).toLowerCase();
  return `Suggest three easy recipes for the given ingredients.

ingredient: potato cream cheese onion
Recipes: Mashed potatoes with cream cheese, Potato and onion hash, Baked cheesy fries
ingredient: garlic pasta chicken
Recipes: Chicken tomato pasta bake, Easy garlic chicken pasta, Garlic butter chicken pesto pasta
ingredient: ${capitalizedIngredient}
Recipes:`;
}
