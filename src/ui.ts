import { CONFIG } from "../config.js";
import { css, div, el, span } from "./dom.js";
import { resetStats } from "./stats.js";

const PANEL_ID = "pokemon-bot-ui";
let minimized = false;

// ── Sync ──────────────────────────────────────────────────────────────────

export function syncUI(isRunning: boolean): void {
  const ui = document.getElementById(PANEL_ID);
  if (!ui) return;

  const btn = document.getElementById("bot-toggle-btn") as HTMLButtonElement;
  btn.textContent = isRunning ? "STOP" : "START";
  btn.style.background = isRunning
    ? "rgba(239,68,68,0.25)"
    : "rgba(255,255,255,0.08)";

  (document.getElementById("bot-dot") as HTMLElement).style.background =
    isRunning ? "#22c55e" : "#555";
  (document.getElementById("bot-name-input") as HTMLInputElement).disabled =
    isRunning;
  (document.getElementById("bot-shiny-check") as HTMLInputElement).disabled =
    isRunning;
}

// ── Minimize ──────────────────────────────────────────────────────────────

function toggleMinimize(): void {
  minimized = !minimized;
  (document.getElementById("bot-body") as HTMLElement).style.display = minimized
    ? "none"
    : "contents";
  (document.getElementById("bot-minimize-btn") as HTMLElement).textContent =
    minimized ? "▲" : "▼";
}

// ── Build ─────────────────────────────────────────────────────────────────

export function createUI(onToggle: () => void): void {
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
    backdropFilter: "blur(6px)",
  });
  box.id = PANEL_ID;

  // Header
  const dot = css(div(), {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#555",
    transition: "background 0.3s",
    flexShrink: "0",
  });
  dot.id = "bot-dot";

  const minBtn = css(
    el("button", { textContent: "▼", id: "bot-minimize-btn" }),
    {
      marginLeft: "auto",
      background: "transparent",
      border: "none",
      color: "rgba(255,255,255,0.4)",
      cursor: "pointer",
      fontSize: "11px",
      padding: "0 2px",
      lineHeight: "1",
    },
  );
  minBtn.onclick = toggleMinimize;

  const header = css(div(), {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  });
  header.append(
    dot,
    span("POKÉMON BOT", {
      fontSize: "11px",
      opacity: "0.5",
      letterSpacing: "0.08em",
    }),
    minBtn,
  );
  box.appendChild(header);

  // Body
  const body = css(div(), { display: "contents" });
  body.id = "bot-body";

  const nameInput = css(
    el("input", {
      type: "text",
      id: "bot-name-input",
      value: CONFIG.target,
      placeholder: "Pokémon name",
    }),
    {
      padding: "6px 9px",
      borderRadius: "7px",
      border: "1px solid rgba(255,255,255,0.15)",
      background: "rgba(255,255,255,0.08)",
      color: "white",
      fontSize: "13px",
      width: "100%",
      boxSizing: "border-box",
    },
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
    opacity: "0.75",
  });
  const shinyCheck = el("input", {
    type: "checkbox",
    id: "bot-shiny-check",
    checked: CONFIG.shinyOnly,
  });
  shinyCheck.onchange = () => {
    CONFIG.shinyOnly = shinyCheck.checked;
  };
  shinyRow.append(
    shinyCheck,
    el("label", { textContent: "Shiny only", htmlFor: "bot-shiny-check" }),
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
      fontWeight: "600",
    },
  );
  btn.onclick = () => {
    if (!nameInput.value.trim()) return;
    CONFIG.target = nameInput.value.trim();
    onToggle();
  };
  body.appendChild(btn);

  body.appendChild(
    css(div(), { height: "1px", background: "rgba(255,255,255,0.1)" }),
  );

  const grid = css(div(), {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "6px",
  });
  for (const [id, label] of [
    ["bot-enc", "Encounters"],
    ["bot-shiny", "✨ Shinies"],
  ]) {
    const cell = css(div(), {
      background: "rgba(255,255,255,0.06)",
      borderRadius: "8px",
      padding: "8px",
      textAlign: "center",
    });
    const v = css(el("span", { textContent: "0", id }), {
      fontSize: "16px",
      fontWeight: "600",
      display: "block",
    });
    const lbl = css(el("span", { textContent: label }), {
      fontSize: "10px",
      opacity: "0.5",
      marginTop: "2px",
      display: "block",
    });
    cell.append(v, lbl);
    grid.appendChild(cell);
  }
  body.appendChild(grid);

  const oddsRow = css(div(), {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    opacity: "0.65",
  });
  const oddsVal = css(el("span", { textContent: "—", id: "bot-odds" }), {
    fontWeight: "600",
    opacity: "1",
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
    fontSize: "11px",
  });
  resetBtn.onclick = resetStats;
  body.appendChild(resetBtn);

  box.appendChild(body);
  document.body.appendChild(box);
}
