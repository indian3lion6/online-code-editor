// src/api.js
export async function getAISuggestion(prompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.5,
      }),
    });

    const data = await response.json();

    // ✅ Log the entire response to debug
    console.log("OpenAI Response:", data);

    if (Array.isArray(data.choices) && data.choices.length > 0) {
        return data.choices[0].text.trim();
    } else {
    console.error("No choices array or it's empty", data);
    return "// No suggestion available";
    }


  } catch (error) {
    console.error("Error in getAISuggestion:", error.message);
    return "// Failed to fetch suggestion";
  }
}
