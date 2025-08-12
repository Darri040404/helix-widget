
// helix-widget.js — einfaldur spjallhnappur fyrir Helix Health
(function(){
  const apiUrl = document.currentScript.dataset.api || "";
  const primaryColor = document.currentScript.dataset.primary || "#059669";
  const position = document.currentScript.dataset.position || "right";

  // Búa til stíla (inline CSS)
  const style = document.createElement("style");
  style.textContent = `
    #helix-chat-btn {
      position: fixed;
      bottom: 20px;
      ${position}: 20px;
      background: ${primaryColor};
      color: #fff;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      z-index: 9999;
    }
    #helix-chat-window {
      position: fixed;
      bottom: 100px;
      ${position}: 20px;
      width: 300px;
      max-height: 400px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
    }
    #helix-chat-messages {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      font-family: sans-serif;
      font-size: 14px;
    }
    #helix-chat-input {
      display: flex;
      border-top: 1px solid #ddd;
    }
    #helix-chat-input input {
      flex: 1;
      border: none;
      padding: 8px;
      font-size: 14px;
    }
    #helix-chat-input button {
      background: ${primaryColor};
      border: none;
      color: #fff;
      padding: 8px 12px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // Búa til hnapp
  const btn = document.createElement("div");
  btn.id = "helix-chat-btn";
  btn.innerHTML = "💬";
  document.body.appendChild(btn);

  // Búa til glugga
  const win = document.createElement("div");
  win.id = "helix-chat-window";
  win.innerHTML = `
    <div id="helix-chat-messages"></div>
    <div id="helix-chat-input">
      <input type="text" placeholder="Skrifaðu skilaboð..." />
      <button>Send</button>
    </div>
  `;
  document.body.appendChild(win);

  const msgs = win.querySelector("#helix-chat-messages");
  const input = win.querySelector("input");
  const sendBtn = win.querySelector("button");

  function addMsg(text, sender) {
    const div = document.createElement("div");
    div.textContent = (sender === "bot" ? "Bot: " : "Þú: ") + text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, "user");
    input.value = "";

    try {
      const res = await fetch(apiUrl + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      addMsg(data.answer, "bot");
    } catch (err) {
      addMsg("Villa við að tengjast API.", "bot");
    }
  }

  btn.addEventListener("click", () => {
    win.style.display = win.style.display === "flex" ? "none" : "flex";
    win.style.flexDirection = "column";
  });

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });
})();
