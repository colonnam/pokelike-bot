export const STATS: { encounters: number; shinies: number } = {
  encounters: 0,
  shinies: 0,
};

export function resetStats(): void {
  STATS.encounters = 0;
  STATS.shinies = 0;
  updateStatsUI();
}

export function updateStatsUI(): void {
  document.getElementById("bot-enc")!.textContent = String(STATS.encounters);
  document.getElementById("bot-shiny")!.textContent = String(STATS.shinies);
  document.getElementById("bot-odds")!.textContent =
    STATS.shinies > 0
      ? "1 / " + Math.round(STATS.encounters / STATS.shinies)
      : "—";
}
