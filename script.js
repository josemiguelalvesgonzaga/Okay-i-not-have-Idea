const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const suggestionButtons = document.querySelectorAll(".suggestion, .chip");
const groqApiKeyInput = document.getElementById("groqApiKey");
const saveApiKeyButton = document.getElementById("saveApiKey");
const newConversationButton = document.getElementById("newConversation");

const STORAGE_KEY = "groq_api_key";
const MODEL = "llama-3.1-8b-instant";

function setInputValueFromStorage() {
  const savedKey = localStorage.getItem(STORAGE_KEY) || "";
  groqApiKeyInput.value = savedKey;
}

function appendMessage(text, sender, isTyping = false) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${sender}`;

  if (isTyping) {
    wrapper.classList.add("typing");
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  wrapper.appendChild(bubble);
  chatWindow.appendChild(wrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return wrapper;
}

function saveKey() {
  const value = groqApiKeyInput.value.trim();

  if (!value) {
    appendMessage("Digite uma chave válida da Groq antes de continuar.", "bot");
    return;
  }

  localStorage.setItem(STORAGE_KEY, value);
  appendMessage("Chave salva com sucesso. Agora você pode conversar com a IA.", "bot");
}

function getSavedKey() {
  return localStorage.getItem(STORAGE_KEY) || "";
}

function clearChat() {
  chatWindow.innerHTML = "";
  appendMessage("Nova conversa iniciada. Como posso ajudar hoje?", "bot");
}

async function callGroq(prompt) {
  const apiKey = getSavedKey();

  if (!apiKey) {
    throw new Error("Chave da Groq não encontrada. Insira sua chave no painel lateral.");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente útil, profissional e amigável. Responda em português do Brasil."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || "Erro ao consultar a API da Groq.";
    throw new Error(message);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "Não consegui gerar uma resposta agora.";
}

async function handleSubmit(event) {
  event.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  userInput.value = "";

  const loader = appendMessage("Pensando...", "bot", true);

  try {
    const reply = await callGroq(message);
    loader.querySelector(".bubble").textContent = reply;
    loader.classList.remove("typing");
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (error) {
    loader.querySelector(".bubble").textContent = error.message || "Ops! Algo deu errado.";
    loader.classList.remove("typing");
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
}

function handleSuggestionClick(message) {
  appendMessage(message, "user");

  const loader = appendMessage("Pensando...", "bot", true);

  callGroq(message)
    .then((reply) => {
      loader.querySelector(".bubble").textContent = reply;
      loader.classList.remove("typing");
      chatWindow.scrollTop = chatWindow.scrollHeight;
    })
    .catch((error) => {
      loader.querySelector(".bubble").textContent = error.message || "Não foi possível responder.";
      loader.classList.remove("typing");
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });
}

saveApiKeyButton.addEventListener("click", saveKey);
chatForm.addEventListener("submit", handleSubmit);
newConversationButton.addEventListener("click", clearChat);

suggestionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const message = button.dataset.message;
    if (!message) return;
    handleSuggestionClick(message);
  });
});

setInputValueFromStorage();
clearChat();
