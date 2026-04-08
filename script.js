// Get references to the DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

// Keep one system message and all user/assistant turns for conversation history
const systemMessage = `You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination.

If a user's query is unrelated to budget travel, respond by stating that you do not know.`;

const messages = [
  { role: 'system', content: systemMessage }
];

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Stop the page from reloading when the form is submitted

  const prompt = userInput.value.trim();

  if (!prompt) {
    return;
  }

  // Add the new user message to the conversation history
  messages.push({ role: 'user', content: prompt });
  userInput.value = ''; // Clear the input right after submit

  responseContainer.textContent = 'Thinking...';

  try {
    // Send the user's prompt to the OpenAI Chat Completions API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_completion_tokens: 800,
        temperature: 0.5,
        frequency_penalty: 0.5
      })
    });

    const result = await response.json();

    if (!response.ok || !result.choices || !result.choices[0]) {
      throw new Error(`HTTP Error! status: ${response.status}`);
    }

    const aiReply = result.choices[0].message.content;

    // Save the assistant reply so it is included in the next API request
    messages.push({ role: 'assistant', content: aiReply });

    // Use textContent so line breaks and spaces from the model are preserved safely
    responseContainer.textContent = aiReply;
  } catch (error) {
    console.error('Error:', error);
    responseContainer.textContent = 'Something went wrong. Please try again.';
  }
});