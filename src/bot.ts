import { CONFIG } from "../config.js";
import { STATS, updateStatsUI } from "./stats.js";

// ── Input ─────────────────────────────────────────────────────────────────

export function clickResetButton(): void {
  const btn = document.querySelector<HTMLButtonElement>(
    'button[onclick="confirmResetRun()"]',
  );
  btn?.click();
  const overlay = document.getElementById("reset-loading-overlay");
  if (overlay) overlay.remove();
  const catchScreen = document.getElementById("catch-screen");
  catchScreen?.classList.remove("active")
}

// ── Game DOM queries ──────────────────────────────────────────────────────

export function clickOpenButton(): void {
  const el = document
    .querySelector('image[href="img/sprites/g1/pokeball.png"]')
    ?.closest("g");
  if (!el) return;
  ["pointerdown", "mousedown", "mouseup", "click"].forEach((type) =>
    el.dispatchEvent(new MouseEvent(type, { bubbles: true })),
  );
}

export function visibleCards(): HTMLElement[] {
  return [
    ...document.querySelectorAll<HTMLElement>(".poke-choice-wrap"),
  ].filter((c) => c.offsetParent !== null);
}

export const isMenuOpen = (): boolean => visibleCards().length > 0;

// ── Card evaluation ───────────────────────────────────────────────────────

export function isTarget(card: HTMLElement): boolean {
  const name = card.querySelector(".poke-name")?.textContent?.trim() ?? "";
  const shiny = !!card.querySelector(".shiny-badge");
  if (!CONFIG.target) return shiny;
  return (
    name.toUpperCase().includes(CONFIG.target.toUpperCase()) &&
    (!CONFIG.shinyOnly || shiny)
  );
}

export function evaluateCards(): boolean {

  if (!CONFIG.shinyOnly ||!isStarterShiny()){
      clickResetButton();
      return false
    }

  const cards = visibleCards();
  if (!cards.length) return false;
  STATS.encounters++;
    cards.forEach((c) => {
    if (c.querySelector(".shiny-badge")) STATS.shinies++;
  });
  updateStatsUI();

  if (cards.find(isTarget)) {
    console.log(`✨ FOUND: ${CONFIG.target}`);
    return true;
  }

  clickResetButton();
  return false;
}

export function isStarterShiny():boolean{
  const firstTeamSlot = document.querySelector(".team-slot");
  return firstTeamSlot!
  .querySelector("img")!
  .src.includes("/shiny/");
}
