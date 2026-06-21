import { CONFIG } from "../config.js";
import { clickOpenButton, evaluateCards, isMenuOpen } from "./bot.js";
import { createUI, syncUI } from "./ui.js";

// ── State ─────────────────────────────────────────────────────────────────

let observer: MutationObserver | null = null;
let openInterval: ReturnType<typeof setInterval> | null = null;

const isRunning = (): boolean => observer !== null;

// ── Observer ──────────────────────────────────────────────────────────────

function startObserver(): void {
  observer = new MutationObserver(() => {
    if (!isMenuOpen()) return;
    const found = evaluateCards();
    if (found) stop();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// ── Open poller ───────────────────────────────────────────────────────────

function startOpenPoller(): void {
  openInterval = setInterval(() => {
    console.log(isMenuOpen());
    if (!isMenuOpen()) clickOpenButton();
  }, CONFIG.openDelay);
}

// ── Start / Stop ──────────────────────────────────────────────────────────

function start(): void {
  startObserver();
  startOpenPoller();
  syncUI(true);
  if (isMenuOpen()) evaluateCards();
  console.log("🟢 BOT ON");
}

function stop(): void {
  observer?.disconnect();
  observer = null;
  if (openInterval !== null) clearInterval(openInterval);
  openInterval = null;
  syncUI(false);
  console.log("🔴 BOT OFF");
}

function toggle(): void {
  isRunning() ? stop() : start();
}

// ── Chrome message listener ───────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg: { type: string }) => {
  if (msg.type !== "TOGGLE_UI") return;
  const ui = document.getElementById("pokemon-bot-ui");
  if (ui) ui.style.display = ui.style.display === "none" ? "flex" : "none";
});

// ── Init ──────────────────────────────────────────────────────────────────

createUI(toggle);
console.log("🔥 CONTENT SCRIPT LOADED");
