(function () {
  /* ── Inject styles ── */
  const style = document.createElement("style");
  style.textContent = `
    #cd-chat-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      height: 48px;
      padding: 0 18px 0 14px;
      border-radius: 24px;
      background: #F5C518;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 20px rgba(245,197,24,0.4);
      z-index: 9999;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #cd-chat-btn:hover { transform: scale(1.05); box-shadow: 0 6px 28px rgba(245,197,24,0.55); }
    #cd-chat-btn svg { width: 22px; height: 22px; fill: #0A0A0A; flex-shrink: 0; }
    #cd-chat-btn-label {
      font-family: 'Bebas Neue', 'Barlow', sans-serif;
      font-size: 1rem;
      color: #0A0A0A;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    #cd-chat-window {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 360px;
      max-width: calc(100vw - 40px);
      height: 520px;
      max-height: calc(100vh - 130px);
      background: #111111;
      border: 1px solid #2A2A2A;
      border-radius: 16px;
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9998;
      box-shadow: 0 12px 48px rgba(0,0,0,0.6);
      font-family: 'Barlow', sans-serif;
    }
    #cd-chat-window.open { display: flex; }

    #cd-chat-header {
      background: #1A1A1A;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #2A2A2A;
    }
    #cd-chat-header-left { display: flex; align-items: center; gap: 10px; }
    #cd-chat-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #F5C518;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Bebas Neue', 'Barlow', sans-serif;
      font-size: 1rem;
      color: #0A0A0A;
      font-weight: 900;
      letter-spacing: 0.03em;
    }
    #cd-chat-title { color: #fff; font-weight: 700; font-size: 0.95rem; }
    #cd-chat-subtitle { color: rgba(255,255,255,0.4); font-size: 0.75rem; margin-top: 1px; }
    #cd-chat-close {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.4);
      padding: 4px;
      display: flex;
      align-items: center;
      border-radius: 6px;
      transition: color 0.15s, background 0.15s;
    }
    #cd-chat-close:hover { color: #fff; background: rgba(255,255,255,0.08); }
    #cd-chat-close svg { width: 18px; height: 18px; }

    #cd-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scrollbar-width: thin;
      scrollbar-color: #2A2A2A transparent;
    }
    #cd-chat-messages::-webkit-scrollbar { width: 4px; }
    #cd-chat-messages::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 4px; }

    .cd-msg {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 0.875rem;
      line-height: 1.55;
      word-break: break-word;
    }
    .cd-msg.bot {
      background: #1A1A1A;
      color: rgba(255,255,255,0.85);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .cd-msg.user {
      background: #F5C518;
      color: #0A0A0A;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      font-weight: 600;
    }
    .cd-msg.error { background: #2a1111; color: #ff7070; }

    #cd-typing {
      display: none;
      align-self: flex-start;
      background: #1A1A1A;
      border-radius: 12px;
      border-bottom-left-radius: 4px;
      padding: 10px 14px;
      gap: 5px;
      align-items: center;
    }
    #cd-typing.show { display: flex; }
    #cd-typing span {
      display: inline-block;
      width: 7px; height: 7px;
      background: rgba(255,255,255,0.35);
      border-radius: 50%;
      animation: cd-bounce 1.2s infinite;
    }
    #cd-typing span:nth-child(2) { animation-delay: 0.2s; }
    #cd-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cd-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }

    #cd-chat-form {
      padding: 12px 14px;
      border-top: 1px solid #2A2A2A;
      display: flex;
      gap: 8px;
    }
    #cd-chat-input {
      flex: 1;
      background: #1A1A1A;
      border: 1px solid #2A2A2A;
      border-radius: 8px;
      padding: 9px 12px;
      color: #fff;
      font-family: 'Barlow', sans-serif;
      font-size: 0.875rem;
      outline: none;
      resize: none;
      transition: border-color 0.2s;
      line-height: 1.4;
      max-height: 80px;
      overflow-y: auto;
    }
    #cd-chat-input:focus { border-color: rgba(245,197,24,0.5); }
    #cd-chat-input::placeholder { color: rgba(255,255,255,0.25); }
    #cd-chat-send {
      background: #F5C518;
      border: none;
      border-radius: 8px;
      width: 38px;
      height: 38px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      align-self: flex-end;
      transition: transform 0.15s, opacity 0.15s;
    }
    #cd-chat-send:hover { transform: scale(1.06); }
    #cd-chat-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    #cd-chat-send svg { width: 16px; height: 16px; fill: #0A0A0A; }

    #cd-chat-badge {
      position: fixed;
      bottom: 78px;
      right: 24px;
      background: #E040FB;
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      pointer-events: none;
    }

    #cd-suggested {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 16px 12px;
      border-bottom: 1px solid #2A2A2A;
    }
    .cd-chip {
      background: #1A1A1A;
      border: 1px solid #2A2A2A;
      color: rgba(255,255,255,0.75);
      font-family: 'Barlow', sans-serif;
      font-size: 0.78rem;
      padding: 5px 11px;
      border-radius: 20px;
      cursor: pointer;
      transition: border-color 0.15s, color 0.15s, background 0.15s;
      white-space: nowrap;
    }
    .cd-chip:hover {
      border-color: #F5C518;
      color: #F5C518;
      background: rgba(245,197,24,0.07);
    }
  `;
  document.head.appendChild(style);

  /* ── Inject HTML ── */
  const html = `
    <button id="cd-chat-btn" aria-label="Open Digital Dice chat">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
      <span id="cd-chat-btn-label">Digital Dice</span>
    </button>
    <div id="cd-chat-badge">1</div>
    <div id="cd-chat-window" role="dialog" aria-label="Digital Dice Chat">
      <div id="cd-chat-header">
        <div id="cd-chat-header-left">
          <div id="cd-chat-avatar">DD</div>
          <div>
            <div id="cd-chat-title">Digital Dice</div>
            <div id="cd-chat-subtitle">Ask me anything</div>
          </div>
        </div>
        <button id="cd-chat-close" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
      <div id="cd-chat-messages">
        <div class="cd-msg bot">Hey! I'm Digital Dice 👋 Ask me about classes, events, coaching, or anything about the Dancehall experience.</div>
      </div>
      <div id="cd-suggested">
        <button class="cd-chip">What classes are available?</button>
        <button class="cd-chip">How do I book a session?</button>
        <button class="cd-chip">Tell me about Chuby</button>
        <button class="cd-chip">Upcoming events?</button>
        <button class="cd-chip">Coaching options</button>
      </div>
      <div id="cd-typing"><span></span><span></span><span></span></div>
      <form id="cd-chat-form">
        <textarea id="cd-chat-input" placeholder="Ask about classes, events..." rows="1"></textarea>
        <button id="cd-chat-send" type="submit" aria-label="Send">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </form>
    </div>
  `;
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  /* ── State ── */
  const history = [];
  let loading = false;

  /* ── Refs ── */
  const btn = document.getElementById("cd-chat-btn");
  const win = document.getElementById("cd-chat-window");
  const closeBtn = document.getElementById("cd-chat-close");
  const messages = document.getElementById("cd-chat-messages");
  const suggested = document.getElementById("cd-suggested");
  const typing = document.getElementById("cd-typing");
  const form = document.getElementById("cd-chat-form");
  const input = document.getElementById("cd-chat-input");
  const send = document.getElementById("cd-chat-send");
  const badge = document.getElementById("cd-chat-badge");

  messages.appendChild(typing);

  /* ── Helpers ── */
  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function addMessage(text, role) {
    const div = document.createElement("div");
    div.className = "cd-msg " + role;
    div.textContent = text;
    messages.insertBefore(div, typing);
    scrollBottom();
    return div;
  }

  function setLoading(val) {
    loading = val;
    send.disabled = val;
    input.disabled = val;
    typing.classList.toggle("show", val);
    if (val) scrollBottom();
  }

  /* ── Suggested chips ── */
  suggested.addEventListener("click", (e) => {
    const chip = e.target.closest(".cd-chip");
    if (!chip || loading) return;
    input.value = chip.textContent;
    suggested.style.display = "none";
    form.requestSubmit();
  });

  /* ── Toggle ── */
  btn.addEventListener("click", () => {
    win.classList.toggle("open");
    badge.style.display = "none";
    if (win.classList.contains("open")) {
      input.focus();
      scrollBottom();
    }
  });

  closeBtn.addEventListener("click", () => win.classList.remove("open"));

  /* ── Auto-resize textarea ── */
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 80) + "px";
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  /* ── Send message ── */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || loading) return;

    input.value = "";
    input.style.height = "auto";

    addMessage(text, "user");
    history.push({ role: "user", content: text });

    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        addMessage("Sorry, something went wrong. Please try again.", "bot error");
      } else {
        addMessage(data.reply, "bot");
        history.push({ role: "assistant", content: data.reply });
        if (!win.classList.contains("open")) {
          badge.style.display = "flex";
        }
      }
    } catch {
      addMessage("Couldn't connect. Please check your connection.", "bot error");
    } finally {
      setLoading(false);
    }
  });
})();
