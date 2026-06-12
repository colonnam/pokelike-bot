import { CONFIG } from "../config.js";
import { STATS, updateStatsUI } from "./stats.js";

// ── Input ─────────────────────────────────────────────────────────────────

export function pressKey(key: string, keyCode: number): void {
  const opts = {
    key,
    code: `Key${key.toUpperCase()}`,
    keyCode,
    which: keyCode,
    bubbles: true,
  };
  document.dispatchEvent(new KeyboardEvent("keydown", opts));
  document.dispatchEvent(new KeyboardEvent("keyup", opts));
}

// ── Game DOM queries ──────────────────────────────────────────────────────

export function clickOpenButton(): void {
  const el = document
    .querySelector('image[href="sprites/catchPokemon.png"]')
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
  const cards = visibleCards();
  if (!cards.length) return false;
  STATS.encounters++;
  const found = cards.find(isTarget);

  if (found) {
    STATS.shinies++;
    updateStatsUI();
    console.log(`✨ FOUND: ${CONFIG.target}`);
    return true;
  }

  cards.forEach((c) => {
    if (c.querySelector(".shiny-badge")) STATS.shinies++;
  });
  updateStatsUI();
  pressKey("r", 82);
  return false;
}
