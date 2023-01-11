import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [ingredientInput, setIngredientInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredient: ingredientInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setIngredientInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/cookbot.png" />
      </Head>

      <main className={styles.main}>
        <img src="/cookbot.png" className={styles.icon} />
        <h3>RECIPE GENERATOR</h3>
        <h4>What’s in the fridge?</h4>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="ingredient"
            placeholder="Enter the ingredients you have"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
          />
          <input type="submit" value="Generate recipes" />
        </form>
        <div className={styles.result}>{result}</div>
        <div id="footer">
        made with 🧡 by  <a href="https://github.com/Absi0">Absi</a>
    </div>
      </main>
    </div>
  );
}
