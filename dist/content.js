"use strict";
(() => {
  // config.ts
  var CONFIG = {
    target: "",
    shinyOnly: true,
    openDelay: 1
  };

  // src/stats.ts
  var STATS = {
    encounters: 0,
    shinies: 0
  };
  function resetStats() {
    STATS.encounters = 0;
    STATS.shinies = 0;
    updateStatsUI();
  }
  function updateStatsUI() {
    document.getElementById("bot-enc").textContent = String(STATS.encounters);
    document.getElementById("bot-shiny").textContent = String(STATS.shinies);
    document.getElementById("bot-odds").textContent = STATS.shinies > 0 ? "1 / " + Math.round(STATS.encounters / STATS.shinies) : "\u2014";
  }

  // src/bot.ts
  function clickResetButton() {
    const btn = document.querySelector(
      'button[onclick="confirmResetRun()"]'
    );
    btn?.click();
    const overlay = document.getElementById("reset-loading-overlay");
    if (overlay) overlay.remove();
    const catchScreen = document.getElementById("catch-screen");
    catchScreen?.classList.remove("active");
  }
  function clickOpenButton() {
    const el2 = document.querySelector('image[href="img/sprites/g1/pokeball.png"]')?.closest("g");
    if (!el2) return;
    ["pointerdown", "mousedown", "mouseup", "click"].forEach(
      (type) => el2.dispatchEvent(new MouseEvent(type, { bubbles: true }))
    );
  }
  function visibleCards() {
    return [
      ...document.querySelectorAll(".poke-choice-wrap")
    ].filter((c) => c.offsetParent !== null);
  }
  var isMenuOpen = () => visibleCards().length > 0;
  function isTarget(card) {
    const name = card.querySelector(".poke-name")?.textContent?.trim() ?? "";
    const shiny = !!card.querySelector(".shiny-badge");
    if (!CONFIG.target) return shiny;
    return name.toUpperCase().includes(CONFIG.target.toUpperCase()) && (!CONFIG.shinyOnly || shiny);
  }
  function evaluateCards() {
    const cards = visibleCards();
    if (!cards.length) return false;
    STATS.encounters++;
    const found = cards.find(isTarget);
    if (found) {
      STATS.shinies++;
      updateStatsUI();
      console.log(`\u2728 FOUND: ${CONFIG.target}`);
      return true;
    }
    cards.forEach((c) => {
      if (c.querySelector(".shiny-badge")) STATS.shinies++;
    });
    updateStatsUI();
    clickResetButton();
    return false;
  }

  // src/dom.ts
  function css(el2, styles) {
    return Object.assign(el2.style, styles), el2;
  }
  function el(tag, props = {}) {
    return Object.assign(document.createElement(tag), props);
  }
  function div(styles = {}) {
    return css(document.createElement("div"), styles);
  }
  function span(text, styles = {}) {
    return css(el("span", { textContent: text }), styles);
  }

  // src/ui.ts
  var PANEL_ID = "pokemon-bot-ui";
  var minimized = false;
  function syncUI(isRunning2) {
    const ui = document.getElementById(PANEL_ID);
    if (!ui) return;
    const btn = document.getElementById("bot-toggle-btn");
    btn.textContent = isRunning2 ? "STOP" : "START";
    btn.style.background = isRunning2 ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.08)";
    document.getElementById("bot-dot").style.background = isRunning2 ? "#22c55e" : "#555";
    document.getElementById("bot-name-input").disabled = isRunning2;
    document.getElementById("bot-shiny-check").disabled = isRunning2;
  }
  function toggleMinimize() {
    minimized = !minimized;
    document.getElementById("bot-body").style.display = minimized ? "none" : "contents";
    document.getElementById("bot-minimize-btn").textContent = minimized ? "\u25B2" : "\u25BC";
  }
  function createUI(onToggle) {
    const box = css(div(), {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "rgba(15,15,15,0.92)",
      color: "white",
      padding: "14px",
      borderRadius: "14px",
      zIndex: "999999",
      fontFamily: "sans-serif",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      minWidth: "200px",
      backdropFilter: "blur(6px)"
    });
    box.id = PANEL_ID;
    const dot = css(div(), {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: "#555",
      transition: "background 0.3s",
      flexShrink: "0"
    });
    dot.id = "bot-dot";
    const minBtn = css(
      el("button", { textContent: "\u25BC", id: "bot-minimize-btn" }),
      {
        marginLeft: "auto",
        background: "transparent",
        border: "none",
        color: "rgba(255,255,255,0.4)",
        cursor: "pointer",
        fontSize: "11px",
        padding: "0 2px",
        lineHeight: "1"
      }
    );
    minBtn.onclick = toggleMinimize;
    const header = css(div(), {
      display: "flex",
      alignItems: "center",
      gap: "8px"
    });
    header.append(
      dot,
      span("POK\xC9MON BOT", {
        fontSize: "11px",
        opacity: "0.5",
        letterSpacing: "0.08em"
      }),
      minBtn
    );
    box.appendChild(header);
    const body = css(div(), { display: "contents" });
    body.id = "bot-body";
    const nameInput = css(
      el("input", {
        type: "text",
        id: "bot-name-input",
        value: CONFIG.target,
        placeholder: "Pok\xE9mon name"
      }),
      {
        padding: "6px 9px",
        borderRadius: "7px",
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.08)",
        color: "white",
        fontSize: "13px",
        width: "100%",
        boxSizing: "border-box"
      }
    );
    nameInput.oninput = () => {
      CONFIG.target = nameInput.value.trim();
    };
    body.appendChild(nameInput);
    const shinyRow = css(div(), {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "12px",
      opacity: "0.75"
    });
    const shinyCheck = el("input", {
      type: "checkbox",
      id: "bot-shiny-check",
      checked: CONFIG.shinyOnly
    });
    shinyCheck.onchange = () => {
      CONFIG.shinyOnly = shinyCheck.checked;
    };
    shinyRow.append(
      shinyCheck,
      el("label", { textContent: "Shiny only", htmlFor: "bot-shiny-check" })
    );
    body.appendChild(shinyRow);
    const btn = css(
      el("button", { textContent: "START", id: "bot-toggle-btn" }),
      {
        padding: "7px 12px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.08)",
        color: "white",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600"
      }
    );
    btn.onclick = () => {
      if (!nameInput.value.trim()) return;
      CONFIG.target = nameInput.value.trim();
      onToggle();
    };
    body.appendChild(btn);
    body.appendChild(
      css(div(), { height: "1px", background: "rgba(255,255,255,0.1)" })
    );
    const grid = css(div(), {
      display: "grid",
      gridTemplateColumns: "repeat(2,1fr)",
      gap: "6px"
    });
    for (const [id, label] of [
      ["bot-enc", "Encounters"],
      ["bot-shiny", "\u2728 Shinies"]
    ]) {
      const cell = css(div(), {
        background: "rgba(255,255,255,0.06)",
        borderRadius: "8px",
        padding: "8px",
        textAlign: "center"
      });
      const v = css(el("span", { textContent: "0", id }), {
        fontSize: "16px",
        fontWeight: "600",
        display: "block"
      });
      const lbl = css(el("span", { textContent: label }), {
        fontSize: "10px",
        opacity: "0.5",
        marginTop: "2px",
        display: "block"
      });
      cell.append(v, lbl);
      grid.appendChild(cell);
    }
    body.appendChild(grid);
    const oddsRow = css(div(), {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "11px",
      opacity: "0.65"
    });
    const oddsVal = css(el("span", { textContent: "\u2014", id: "bot-odds" }), {
      fontWeight: "600",
      opacity: "1"
    });
    oddsRow.append(el("span", { textContent: "Shiny rate" }), oddsVal);
    body.appendChild(oddsRow);
    const resetBtn = css(el("button", { textContent: "Reset stats" }), {
      padding: "5px",
      borderRadius: "7px",
      border: "1px solid rgba(255,255,255,0.1)",
      background: "transparent",
      color: "rgba(255,255,255,0.45)",
      cursor: "pointer",
      fontSize: "11px"
    });
    resetBtn.onclick = resetStats;
    body.appendChild(resetBtn);
    box.appendChild(body);
    document.body.appendChild(box);
  }

  // src/index.ts
  var observer = null;
  var openInterval = null;
  var isRunning = () => observer !== null;
  function startObserver() {
    observer = new MutationObserver(() => {
      if (!isMenuOpen()) return;
      const found = evaluateCards();
      if (found) stop();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  function startOpenPoller() {
    openInterval = setInterval(() => {
      console.log(isMenuOpen());
      if (!isMenuOpen()) clickOpenButton();
    }, CONFIG.openDelay);
  }
  function start() {
    startObserver();
    startOpenPoller();
    syncUI(true);
    if (isMenuOpen()) evaluateCards();
    console.log("\u{1F7E2} BOT ON");
  }
  function stop() {
    observer?.disconnect();
    observer = null;
    if (openInterval !== null) clearInterval(openInterval);
    openInterval = null;
    syncUI(false);
    console.log("\u{1F534} BOT OFF");
  }
  function toggle() {
    isRunning() ? stop() : start();
  }
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type !== "TOGGLE_UI") return;
    const ui = document.getElementById("pokemon-bot-ui");
    if (ui) ui.style.display = ui.style.display === "none" ? "flex" : "none";
  });
  createUI(toggle);
  console.log("\u{1F525} CONTENT SCRIPT LOADED");
})();
