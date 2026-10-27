const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const suggestionButtons = document.querySelectorAll(".suggestion, .chip");

const botResponses = [
  "Posso te ajudar com isso. Vamos explorar a melhor solução para o seu caso.",
  "Entendi. Aqui vai uma abordagem simples e eficiente para você começar.",
  "Ótima pergunta! A melhor forma é definir o objetivo primeiro e partir para a execução.",
  "Claro! Posso orientar a melhor decisão com base no seu contexto e necessidade.",
  "Perfeito. Podemos fazer isso de forma prática e escalável para seu negócio."
];

function appendMessage(text, sender) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  wrapper.appendChild(bubble);
  chatWindow.appendChild(wrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getBotReply(message) {
  const lower = message.toLowerCase();

  if (lower.includes("preço") || lower.includes("precos") || lower.includes("plano")) {
    return "Os planos são pensados para crescer junto com seu negócio. Podemos sugerir a melhor opção conforme o número de usuários, integrações e automações que você precisa.";
  }

  if (lower.includes("produto") || lower.includes("serviço") || lower.includes("funciona")) {
    return "O serviço funciona como um assistente inteligente para responder dúvidas, automatizar processos e melhorar o atendimento em tempo real.";
  }

  if (lower.includes("suporte") || lower.includes("problema") || lower.includes("erro")) {
    return "Posso ajudar com suporte técnico. Me diga qual erro ou comportamento você está enfrentando e eu te passo a melhor orientação.";
  }

  if (lower.includes("automação") || lower.includes("exemplo")) {
    return "Um exemplo de automação é responder dúvidas frequentes, coletar dados de clientes, agendar lembretes e encaminhar pedidos para atendimento humano.";
  }

  if (lower.includes("olá") || lower.includes("oi") || lower.includes("bom dia") || lower.includes("boa tarde") || lower.includes("boa noite")) {
    return "Olá! Tudo bem? Posso te ajudar com informações sobre o produto, planos ou suporte.";
  }

  return botResponses[Math.floor(Math.random() * botResponses.length)];
}

function handleSubmit(event) {
  event.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  userInput.value = "";

  setTimeout(() => {
    appendMessage(getBotReply(message), "bot");
  }, 350);
}

chatForm.addEventListener("submit", handleSubmit);

suggestionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const message = button.dataset.message;
    if (!message) return;

    appendMessage(message, "user");

    setTimeout(() => {
      appendMessage(getBotReply(message), "bot");
    }, 300);
  });
});
