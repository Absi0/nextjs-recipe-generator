import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const ingredient = req.body.ingredient || '';
  if (ingredient.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid ingredient",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(ingredient),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(ingredient) {
  const capitalizedIngredient =
  ingredient[0].toUpperCase() + ingredient.slice(1).toLowerCase();
  return `Suggest three generic recipes for the ingredients entered.

  ingredient: potato cream cheese Onion
  Recipes: Mashed potato recipe with cream cheese, Onion and potato hash, Baked Fries
  ingredient: garlic pasta chicken
  Recipes: chicken, tomato and pasta bake, Easy Garlic Chicken Pasta, Garlic butter chicken pesto pasta
  ingredient: ${capitalizedIngredient}
  Recipes:`;
    
}
