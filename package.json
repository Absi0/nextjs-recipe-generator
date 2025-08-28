// pages/api/generate.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ingredient = req.body.ingredient || "";
  if (ingredient.trim().length === 0) {
    return res.status(400).json({ error: "Please enter a valid ingredient." });
  }

  try {
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct", // ✅ replacement for text-davinci-003
      prompt: `Suggest three easy recipes using the following ingredients: ${ingredient}`,
      max_tokens: 200,
      temperature: 0.7,
    });

    const text = completion.data.choices[0]?.text?.trim();
    res.status(200).json({ result: text });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Something went wrong." });
  }
}
